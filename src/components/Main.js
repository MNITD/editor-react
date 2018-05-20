import React, {Component} from 'react';
import {getDocuments} from "../api";
import BlockList from "../containers/BlockList";


class Main extends Component {
    constructor(props){
        super(props);
        this.state = {documents: []}
        getDocuments().then(documents => this.setState({...this.state, documents}));
    }
    getDocumentList(){
        const documents = this.state.documents;
        return documents.map(({name, id, link}) => (<li>name</li>));
    }
    render(){
        return (<div>
            <ul>
                {this.getDocumentList()}
            </ul>
        </div>)
    }
}

export default Main;