import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './modals.css';

export const SideModal = (props: {
    title:string;
    children: [ModalHeader, ModalBody, ModalFooter];
    open : boolean;
    toggle : () => void;
    direction: 'right' | 'left';
}) => (
    <Modal isOpen={props.open} toggle={props.toggle} className="">
      {props.children}
    </Modal>
);
