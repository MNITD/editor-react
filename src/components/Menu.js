/**
 * Created by bogdan on 22.02.18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import BlockList from '../containers/BlockList';
import {redoState, undoState} from '../actions/undoActions';
// style
import '../styles/Menu.scss';

class Menu extends Component{
    render(){
        return (
            <nav className="menu">
                <div className="menu__tab menu__toggle">
                    <NavLink  to='/' className="menu__tab-link"><i className="material-icons">menu</i></NavLink>
                </div>
                <div className="menu__tab">
                    <i className="material-icons">add_box</i>
                    <div className="menu__tab-container">
                        <div className="menu__tab-content">
                            <h1 className="menu__tab-heading">Components</h1>
                            <BlockList initDraggable={::this.props.initDraggable}/>
                        </div>
                    </div>
                </div>

                {/*<div className="menu__tab">*/}
                    {/*<a href="" className="menu__tab-link">*/}
                       {/*<span className="menu__badge" data-badge="1">*/}
                            {/*<i className="material-icons">notifications</i>*/}
                        {/*</span>*/}
                        {/*<div className="menu__tab-container">*/}
                            {/*<div className="menu__tab-content">*/}
                                {/*<h1 className="menu__tab-heading">Notifications</h1>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</a>*/}
                {/*</div>*/}

                <div className="menu__tab" onClick={this.props.undoState}>
                        <i className="material-icons">undo</i>
                        <div className="menu__tab-container">
                            <div className="menu__tab-content">
                                <h1 className="menu__tab-heading">Undo</h1>
                            </div>
                        </div>
                </div>
                <div className="menu__tab" onClick={this.props.redoState}>
                        <i className="material-icons">redo</i>
                        <div className="menu__tab-container">
                            <div className="menu__tab-content">
                                <h1 className="menu__tab-heading">Redo</h1>
                            </div>
                        </div>
                </div>

                {/*<div className="menu__tab">*/}
                    {/*<a href="" className="menu__tab-link">*/}
                        {/*<i className="material-icons">visibility</i>*/}
                        {/*<div className="menu__tab-container">*/}
                            {/*<div className="menu__tab-content">*/}
                                {/*<h1 className="menu__tab-heading">Preview</h1>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</a>*/}
                {/*</div>*/}

                {/*<div className="menu__tab">*/}
                    {/*<i className="material-icons">settings</i>*/}
                    {/*<div className="menu__tab-container">*/}
                        {/*<div className="menu__tab-content">*/}
                            {/*<h1 className="menu__tab-heading">Settings</h1>*/}
                            {/*<ul className="menu__tab-list menu__tab-list--primary">*/}
                                {/*<li className="menu__tab-section">*/}
                                    {/*<a className="menu__tab-section-title" href="">About</a>*/}
                                {/*</li>*/}
                                {/*<li className="menu__tab-section" >*/}
                                    {/*<a className="menu__tab-section-title" href="">Help</a>*/}
                                {/*</li>*/}
                                {/*<li className="menu__tab-section menu__tab-section--top-separator">*/}
                                    {/*<span className="menu__tab-section-title">Log out</span>*/}
                                {/*</li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

            </nav>
        );
    }
}

export default connect(null, {undoState, redoState})(Menu);