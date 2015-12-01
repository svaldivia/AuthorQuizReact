var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
window.$ = window.jQuery = $;
var bootstrap = require('bootstrap');
var _ = require('underscore');

var Quiz = React.createClass({
    propTypes: {
        // data: React.PropTypes.array.isRequired
        //TODO: add select game
    },
    loadDataFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
                game: this.props.selectGame(data),
                data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    getInitialState: function () {
        return {
            bgClass: 'neutral',
            showContinue: false
        };
    },
    componentDidMount: function(){
        //Load from server
        this.loadDataFromServer();
    },
    handleBookSelected: function(title){
        var isCorrect = this.state.game.checkAnswer(title);
        this.setState({
            bgClass: isCorrect? 'pass' : 'fail',
            showContinue: isCorrect
        });
    },
    handleContinue: function(){
        var state = _.extend(this.getInitialState(),
            {game: this.props.selectGame(this.state.data)});
        this.setState(state);
    },
    handleAddAuthor: function (){
        routie('add');
    },
    render: function() {
        if(this.state.data){
            return (<div>
                        <div className ="row">
                            <div className="col-md-4">
                                <img src={this.state.game.author.imageUrl} className="authorimage col-md-3" />
                            </div>
                            <div className="col-md-7">
                                {this.state.game.books.map(function(b){
                                    return <Book onBookSelected={this.handleBookSelected} title={b} />;
                                }, this)}
                            </div>
                            <div className={"col-md-1 "+this.state.bgClass}></div>
                        </div>
                    {this.state.showContinue?(
                        <div className="row">
                            <div className="col-md-12">
                                <input onClick={this.handleContinue} type="button" value="Continue" className="btn btn-primary button"/>
                            </div>
                        </div>
                    ): <span />}
                        <div className="row">
                            <div className="col-md-12">
                                <input onClick={this.handleAddAuthor} type="addAuthorButton" value="Add Author" className="btn btn-primary button"/>
                            </div>
                        </div>
                    </div>
            );
        } else {
            return <h1>Loading...</h1>;
        }
    }
});

var Book = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired
    },
    handleClick:function () {
        this.props.onBookSelected(this.props.title);
    },
    render: function() {
        return <div onClick={this.handleClick} className="answer">
        <h4> {this.props.title}</h4>
        </div > ;
    }
})

var AddGameForm = React.createClass({
    propTypes:{
        onGameFormSubmitted: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            bookCount: 1
        };
    },
    handleSubmit: function (){
        var newAuthor = getRefs(this);
        var bookArray = [];
        for (var i = 0; i < this.state.bookCount; i++) {
            bookArray.push(newAuthor["book"+i]);
        }
        var quizData = {
            imageUrl: newAuthor.imageUrl,
            books: bookArray,
            name: newAuthor.name
        };
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(quizData),
            success: function(data) {
                routie('');
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        return false;
    },
    handleClick: function(){
        this.setState({
            bookCount: ++this.state.bookCount
        });
    },
    render: function () {
        var that = this;
        var bookArray = [];
        for(var i =0; i < that.state.bookCount ; i++){
            bookArray.push(
                <div className="form-group">
                    <input ref={"book"+i} type="text" className="form-control" placeholder="book"/>
                </div>
            );
        }
        return <div className="row">
            <div className="col-md-12">
                <h1>Add Author</h1>
                <form role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input ref="imageUrl" type="text" className="form-control" placeholder="Image Url"/>
                    </div>
                    <div className="form-group">
                        <input ref="name" type="text" className="form-control" placeholder="Name"/>
                    </div>
                    {bookArray}
                    <button type="button" className= "btn btn-primary" onClick={this.handleClick}>Add Book</button>
                    <button type="submit" className= "btn btn-default">Submit</button>
                </form>
            </div>
        </div>;
    }
});

var selectGame = function(data){
    // Select a random 4 books of the given list
    var books = _.shuffle(data.reduce(function(p,c,i){
        if(c.books.length>1){
            var randomBook = [];
            randomBook.push(c.books[_.random(c.books.length-1)]);
            return p.concat(randomBook);
        } else {
            return p.concat(c.books);
        };
    },[])).slice(0,4);

    // Pick an answer from the random books
    var answer = books[_.random(books.length-1)];

    return {
        books: books,
        author: _.find(data, function (author){
            return author.books.some(function (title){
                return title === answer;
            })
        }),
        checkAnswer: function (title){
            return answer === title;
        }
    };
}


routie({
    '':function () {
        ReactDOM.render( < Quiz url="data.json" selectGame={selectGame}/>,
            document.getElementById('app')
        );
    },
    'add':function () {
        ReactDOM.render(<AddGameForm url="data.json" onGameFormSubmitted={handleAddFormSubmitted}/>,document.getElementById('app'));
    }
});

function handleAddFormSubmitted(data){
    var quizData = [{
        imageUrl: data.imageUrl,
        books: [data.answer1, data.answer2,data.answer3,data.answer4]
    }];
    quizData.selectGame = selectGame;
    ReactDOM.render(<Quiz data={quizData} />, document.getElementById('app'));
}

function getRefs(component){
    var result = {};
    Object.keys(component.refs).forEach((refName)=> {
        result[refName] = component.refs[refName].value.trim();
    });
    return result;
}
