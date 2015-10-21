var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
window.$ = window.jQuery = $;
var bootstrap = require('bootstrap');

var Quiz = React.createClass({
    render: function () {
        return <div>
        {this.props.books.map(function(b){
            return <Book title={b} />;
        })}
        </div>;
    }
});

var Book = React.createClass({
    render: function (){
        return <div><h4>{this.props.title}</h4></div>;
    }
})

ReactDOM.render(
  <Quiz books={["Book 1","Book 2"]}/>,
  document.getElementById('app')
);
