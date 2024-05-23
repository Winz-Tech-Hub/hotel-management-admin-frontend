/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap'

class ModalBox extends Component {
  constructor(props) {
    super(props)
    this.modalRef = React.createRef()
    this.acceptRef = React.createRef()
    this.cancelRef = React.createRef()
    this.listener.bind(this)
  }

  listener(forF, e, refToEmitter) {
    const fn = this.props[forF]
    if (fn) {
      fn(e, refToEmitter)
    }
  }

  componentDidMount() {
    const focusOnCancel = this.cancelRef.current
    focusOnCancel && focusOnCancel.focus()
  }

  render() {
    return (
      <Modal
        ref={this.modalRef}
        className={`modal-${this.props.size} modal-${this.props.type}`}
        size={this.props.size}
        animation={this.props.animation}
        scrollable={this.props.scrollable}
        fullscreen={this.props.fullscreen}
        centered={this.props.centered}
        show={this.props.show}
        onHide={(e) => {
          this.listener('onCancel', e, this.cancelRef)
        }}
        keyboard={this.props.keyboard}
        autoFocus={this.props.autoFocus}
        backdrop={this.props.backdrop || false}
      >
        <Modal.Header className="justify-content-center" style={this.props.style} closeButton>
          {!this.props.noHeader ? <div className="modal-profile">{this.props.header}</div> : null}
        </Modal.Header>
        <Modal.Body className={`${this.props.className || ''}`} style={this.props.style}>
          {this.props.children || this.props.body}
        </Modal.Body>
        {this.props.control && !this.props.noControl ? (
          <div className="modal-footer" style={this.props.style}>
            <Button
              ref={this.cancelRef}
              className="btn btn-default"
              type="button"
              variant="link"
              onClick={(e) => {
                this.listener('onCancel', e, this.cancelRef)
              }}
            >
              {this.props.cancelText}
            </Button>
            <Button
              ref={this.acceptRef}
              className={`btn btn-outline-${this.props.type}`}
              type="button"
              variant={this.props.type}
              onClick={(e) => {
                this.listener('onAccept', e, this.acceptRef)
              }}
            >
              {this.props.acceptText}
            </Button>
          </div>
        ) : null}
      </Modal>
    )
  }
}

ModalBox.defaultProps = {
  header: <i className="fa fa-bell" style={{ fontSize: '50px' }}></i>,
  body: <p>Success</p>,
  cancelText: 'Cancel',
  acceptText: 'Ok',
  show: true,
  control: true,
  type: 'primary',
  size: 'md',
  keyboard: true,
  autoFocus: false,
  animation: false,
  scrollable: false,
  // fullscreen: 'sm-down',
  centered: false,
}

export default ModalBox
export { ModalBox as Modal }
