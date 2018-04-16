/**
 * Created by bogdan on 22.02.18.
 */
import React from 'react';
import {Component} from 'react';
import ComponetList from '../containers/ComponentList';
import HierarchyTree from '../containers/HierarchyTree';


// style
import '../styles/Menu.scss';

class Menu extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <nav className="menu">
                <div className="menu__tab menu__toggle"><i className="material-icons">menu</i></div>

                <div className="menu__tab">
                    <i className="material-icons">add_box</i>
                    <div className="menu__tab-container">
                        <div className="menu__tab-content">
                            <h1 className="menu__tab-heading">Components</h1>
                            <ul className="menu__tab-list menu__tab-list--primary">
                                <li className="menu__tab-section">
                                    <a className="menu__tab-section-title"></a>
                                    <ul className="menu__tab-list ">
                                        <li className="menu__tab-subsection">
                                            <a className="menu__tab-link">
                                                <span className="menu__tab-subsection-title"></span>
                                            </a>
                                        </li>
                                        <li className="menu__tab-subsection"
                                            ng-repeat="location in rootVm.user.company.locations track by location.id"
                                            ui-sref-active="menu__tab-subsection--active">
                                            <a className="menu__tab-link"
                                               ui-sref="main-admin.stats.general({'locationId':location.id})">
                                                <span
                                                    className="menu__tab-subsection-title"></span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu__tab-section" ui-sref-active="menu__tab-section--active">
                                    <a className="menu__tab-section-title"
                                       ui-sref="main-admin.stats.clients"></a>
                                    <ul className="menu__tab-list ">
                                        <li className="menu__tab-subsection"
                                            ui-sref-active="menu__tab-subsection--active">
                                            <a className="menu__tab-link"
                                               ui-sref="main-admin.stats.clients({'locationId':null})">
                                                <span
                                                    className="menu__tab-subsection-title"></span>
                                            </a>
                                        </li>
                                        <li className="menu__tab-subsection"
                                            ng-repeat="location in rootVm.user.company.locations track by location.id"
                                            ui-sref-active="menu__tab-subsection--active">
                                            <a className="menu__tab-link"
                                               ui-sref="main-admin.stats.clients({'locationId':location.id})">
                                                <span
                                                    className="menu__tab-subsection-title"></span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu__tab-section" ui-sref-active="menu__tab-section--active">
                                    <a className="menu__tab-section-title"
                                       ui-sref="main-admin.stats.products"></a>
                                    <ul className="menu__tab-list ">
                                        <li className="menu__tab-subsection"
                                            ui-sref-active="menu__tab-subsection--active">
                                            <a className="menu__tab-link"
                                               ui-sref="main-admin.stats.products({'locationId':null})">
                                                <span
                                                    className="menu__tab-subsection-title"></span>
                                            </a>
                                        </li>
                                        <li className="menu__tab-subsection"
                                            ng-repeat="location in rootVm.user.company.locations track by location.id"
                                            ui-sref-active="menu__tab-subsection--active">
                                            <a className="menu__tab-link"
                                               ui-sref="main-admin.stats.products({'locationId':location.id})">
                                                <span className="menu__tab-subsection-title"></span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="menu__tab">
                    <a ui-sref=".clients.list" className="menu__tab-link">
                        <i className="material-icons">grid_on</i>
                        <div className="menu__tab-container">
                            <div className="menu__tab-content">
                                <h1 className="menu__tab-heading">Containers</h1>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="menu__tab">
                    <a ui-sref=".notifications.pending-booking-requests" className="menu__tab-link">
                       <span className="menu__badge" data-badge="0">
                            <i className="material-icons">notifications</i>
                        </span>
                        <div className="menu__tab-container">
                            <div className="menu__tab-content">
                                <h1 className="menu__tab-heading"></h1>
                                <ul className="menu__tab-list menu__tab-list--primary">
                                    <li className="menu__tab-section"
                                        ui-sref-active="menu__tab-section--active">
                                        <a className="menu__tab-section-title"
                                           ui-sref=".notifications.pending-booking-requests"></a>
                                    </li>
                                    <li className="menu__tab-section"
                                        ui-sref-active="menu__tab-section--active">
                                        <a className="menu__tab-section-title"
                                           ui-sref=".notifications.booking-requests-history"></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="menu__tab">
                    <a ui-sref=".clients.list" className="menu__tab-link">
                        <i className="material-icons">undo</i>
                        <div className="menu__tab-container">
                            <div className="menu__tab-content">
                                <h1 className="menu__tab-heading">Undo</h1>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="menu__tab">
                    <a ui-sref=".services-and-products.services-categories" className="menu__tab-link">
                        <i className="material-icons">visibility</i>
                        <div className="menu__tab-container">
                            <div className="menu__tab-content">
                                <h1 className="menu__tab-heading">Preview</h1>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="menu__tab">
                    <i className="material-icons">settings</i>
                    <div className="menu__tab-container">
                        <div className="menu__tab-content">
                            <h1 className="menu__tab-heading">Settings</h1>
                            <ul className="menu__tab-list menu__tab-list--primary">
                                <li className="menu__tab-section">
                                    <a className="menu__tab-section-title"
                                       href="http://bloknotapp.helpscoutdocs.com/category/8-category"
                                       ng-hide="rootVm.user.company.language === 'en'"
                                       target="_blank"></a>
                                </li>
                                <li className="menu__tab-section" ui-sref-active="menu__tab-section--active">
                                    <a className="menu__tab-section-title"
                                       ui-sref=".settings.general"></a>
                                </li>

                                <li className="menu__tab-section" ui-sref-active="menu__tab-section--active">
                                    <a className="menu__tab-section-title"
                                       ui-sref=".settings.medcard"></a>
                                </li>
                                <li className="menu__tab-section menu__tab-section--top-separator">
                                    <span className="menu__tab-section-title"
                                          ng-click="rootVm.logout()"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/*<ComponetList initDraggable={::this.props.initDraggable}/>*/}

            </nav>
        );
    }
}

export default Menu;