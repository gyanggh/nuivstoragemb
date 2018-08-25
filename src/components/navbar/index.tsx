import * as React from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import {
    Collapse,
    Navbar as Navbarstrap,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { State } from '../../store';
import { toggleNav } from '../../actions/ui';
import { RoutePath } from '../../index';

const mapStateToProps = ({ ui }: State, { paths } : {paths:RoutePath[]}) => ({
    paths,
    open: ui.navOpen,
});

const mapDispatchToProps = {
    toggle: toggleNav,
};

const stateProps = returntypeof(mapStateToProps);
type NavbarProps = (typeof stateProps) & (typeof mapDispatchToProps);

const navbar = (props : NavbarProps) => (
    <div>
        <Navbarstrap dark fixed="top" expand="md">
            <NavbarToggler onClick={ev => props.toggle() } />
            <NavbarBrand href="/">Brand</NavbarBrand>
            <Collapse isOpen={props.open} navbar>
                <Nav pills navbar>
                    {props.paths.map(path => (
                        <NavItem key={path.path}>
                           <NavLink
                               exact
                               to={path.path}
                               className="nav-link"
                               activeClassName="active">
                               {path.name}
                           </NavLink>
                        </NavItem>
                    ))}
                    <NavItem>
                        auth
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbarstrap>
    </div>);

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(navbar);
