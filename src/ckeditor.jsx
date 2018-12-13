/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class CKEditor extends React.Component {
	constructor( props ) {
		super( props );

		// After mounting the editor, the variable will contain a reference to the created editor.
		// @see: https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html
		this.editor = null;
	}

	componentDidUpdate() {
		if ( !this.editor ) {
			return;
		}

		if ( 'data' in this.props && this.props.data !== this.editor.getData() ) {
			this.editor.setData( this.props.data );
		}

		if ( 'disabled' in this.props ) {
			this.editor.isReadOnly = this.props.disabled;
		}
	}

	// Initialize the editor when the component is mounted.
	componentDidMount() {
		this._initializeEditor();
	}

	// Destroy the editor before unmouting the component.
	componentWillUnmount() {
		this._destroyEditor();
	}

	// Render a <div> element which will be replaced by CKEditor.
	render() {
		return (
			<div style={this.props.style} ref={ ref => ( this.domContainer = ref ) }></div>
		);
	}

	_initializeEditor() {
		this.props.editor
			.create( this.domContainer, this.props.config )
			.then( editor => {
				this.editor = editor;

				if ( this.props.data ) {
					editor.setData( this.props.data );
				}

				if ( 'disabled' in this.props ) {
					editor.isReadOnly = this.props.disabled;
				}

				if ( this.props.onInit ) {
					this.props.onInit( editor );
				}

				const modelDocument = editor.model.document;
				const viewDocument = editor.editing.view.document;

				modelDocument.on( 'change:data', event => {
					/* istanbul ignore else */
					if ( this.props.onChange ) {
						this.props.onChange( event, editor );
					}
				} );

				viewDocument.on( 'focus', event => {
					/* istanbul ignore else */
					if ( this.props.onFocus ) {
						this.props.onFocus( event, editor );
					}
				} );

				viewDocument.on( 'blur', event => {
					/* istanbul ignore else */
					if ( this.props.onBlur ) {
						this.props.onBlur( event, editor );
					}
				} );
			} )
			.catch( error => {
				console.error( error );
			} );
	}

	_destroyEditor() {
		if ( this.editor ) {
			this.editor.destroy()
				.then( () => {
					this.editor = null;
				} );
		}
	}
}

// Properties definition.
CKEditor.propTypes = {
	editor: PropTypes.func.isRequired,
	data: PropTypes.string,
	config: PropTypes.object,
	onChange: PropTypes.func,
	onInit: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	disabled: PropTypes.bool,
	style: PropTypes.objcet,
};

// Default values for non-required properties.
CKEditor.defaultProps = {
	config: {},
	style: {},
};

