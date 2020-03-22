import React from 'react';
import ReactDom from 'react-dom';

const App = props => {
    return (
        <h1>{'Hello World!'}</h1>
    )
};

ReactDom.render(<App />, document.querySelector('#app'));
