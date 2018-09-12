import * as React from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import {
    Collapse,
    Navbar as Navbarstrap,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    DropdownMenu,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { State } from '../../store';
import { toggleNav } from '../../actions/ui';
import { RoutePath, RoutePathEnd } from '../../index';
import { translate } from '../../helpers';

const mapStateToProps = ({ ui }: State, { paths } : {paths:RoutePath[]}) => ({
    paths,
    open: ui.navOpen,
});

const mapDispatchToProps = {
    toggle: toggleNav,
};

const stateProps = returntypeof(mapStateToProps);
type NavbarProps = (typeof stateProps) & (typeof mapDispatchToProps);
const renderSinglePath = (path : RoutePathEnd, prefix : string) => (
    <NavItem key={path.path}>
       <NavLink
           exact
           to={prefix + path.path}
           className="nav-link"
           activeClassName="active">
           {translate(path.name)}
       </NavLink>
    </NavItem>
);
const navbar = (props : NavbarProps) => (
    <div>
        <Navbarstrap dark color="dark " fixed="top" expand="md">
            <NavbarToggler onClick={ev => props.toggle() } />
            <NavbarBrand href="/">Brand</NavbarBrand>
            <Collapse isOpen={props.open} navbar>
                <Nav pills navbar>
                    {props.paths.filter(path => !path.supress).map(
                        path => path.page ? renderSinglePath(path, '') :
                            <UncontrolledDropdown key={path.prefix} nav inNavbar>
                                <DropdownToggle nav caret>
                                    {translate(path.nameBase)}
                                </DropdownToggle>
                                <DropdownMenu className="bg-dark">
                                    {path.children.filter(childPath => !childPath.supress).map(
                                        pathEnd =>
                                        <DropdownItem key={pathEnd.name}>
                                            {renderSinglePath(pathEnd, path.prefix)}
                                        </DropdownItem>,
                                    )}
                                </DropdownMenu>
                            </UncontrolledDropdown>,
                     )}
                </Nav>
                <Nav navbar className="ml-md-auto">
                    <NavItem className="ml-auto">
                        auth
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbarstrap>
    </div>);

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(navbar);
