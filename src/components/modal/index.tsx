import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { closeModal } from '../../actions/ui';
import { State } from '../../store';

import './modals.css';

const mapStateToProps = (state: State) => (state.ui.modal != null ? {
    children: state.ui.modal.children,
    direction: state.ui.modal.direction,
    isOpen: true,
} : {
    isOpen : false,
});

const mapDispatchToProps = {
    closeModal,
};

type SideModalProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const SideModal = connect(mapStateToProps, mapDispatchToProps)((props: SideModalProps) => (<>
    {props.isOpen ? <Modal isOpen={props.isOpen}
        toggle={props.closeModal}
        className={'modal-' + props.direction}>
        {props.children != null ? <>
            <ModalHeader> {props.children[0]} </ModalHeader>,
            <ModalBody> {props.children[1]} </ModalBody>,
            <ModalFooter> {props.children[2]} </ModalFooter>,
        </> : null}
    </Modal> : null}
</>));
