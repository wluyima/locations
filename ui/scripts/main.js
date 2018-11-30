const root = document.querySelector('#root');
const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;

const BASE_URL = 'http://localhost:3000/api/locations';

//TODO use browserify so that require these from separate file rather than in same file
class Edit extends React.Component {
    constructor(props){
        super(props);
        this.state = {location: {}};
    }

    componentDidMount() {
        var component = this;
        if(this.props.match.params.id){
            axios.get(BASE_URL+'/'+this.props.match.params.id)
                .then(function(response){
                    component.state = {...component.state, location: response.data};
                }).catch(function(err){
                    console.error('ERROR:'+err);
                });
        }
    }

    onChange() {
        console.log('Change..');
    }

    save(e) {
        e.preventDefault();
        console.log('Saving..');
        this.props.history.goBack();
    }

    cancel(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    render() {
        return (
            <form onSubmit={this.save.bind(this)}>
                <h2>{this.props.match.params.id ? 'Edit Location' : 'New Location'}</h2>
                {this.props.match.params.id && 'Address'}
                <p><input value={this.state.location.address} onChange={this.onChange} placeholder="Address" /></p>
                {this.props.match.params.id && 'City'}
                <p><input value={this.state.location.city} onChange={this.onChange} placeholder="City" /></p>
                {this.props.match.params.id && 'State'}
                <p><input value={this.state.location.state} onChange={this.onChange} placeholder="State" /></p>
                {this.props.match.params.id && 'Code'}
                <p><input value={this.state.location.zipcode} onChange={this.onChange} placeholder="Zip Code" /></p>
                <p>
                    <button type="submit">Save</button>
                    &nbsp;&nbsp;
                    <button onClick={this.cancel.bind(this)}>Cancel</button>
                </p>
            </form>
        );
    }
}

class NoMatch extends React.Component { 
    render() {
        return (
            <div>
                <h3>Page Not Fond</h3>
                <p>
                    <Link to="/">Home</Link>
                </p>
            </div>
        );
    }
}

class Locations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            locations : []
        };
    }

    componentDidMount(){
        var component = this;
        axios.get(BASE_URL)
            .then(function(response){
                component.setState({...component.state, locations: response.data});
            }).catch(function(err){
                console.error('ERROR:'+err);
            });
    }

    add(){
        this.props.history.push('edit');
    }
    
    render(){

        var locations = this.state.locations.map((loc) => {
            return (
                <tr key={loc.id}>
                    <td>{loc.address}</td>
                    <td>{loc.city}</td>
                    <td>{loc.state}</td>
                    <td>{loc.zipcode}</td>
                    <td>
                        <Link to={{ pathname:'edit/'+loc.id }} title="Edit">Edit</Link>
                        &nbsp;
                        <Link to={{ pathname:'delete/'+loc.id }}  title="Delete">Delete</Link>
                    </td>
                </tr>
            );
        });
        
        return (
            <div>
                <h2>Locations</h2>
                <p><button onClick={this.add.bind(this)}>Add New Location</button></p>
                <table border="1" cellSpacing="1" cellPadding="5">
                    <thead>
                        <tr>
                            <th>Street</th><th>City</th><th>State</th><th>Zipcode</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{locations}</tbody>
                </table>
            </div>
        );
    }   
}

class Main extends React.Component {

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Locations} />
                        <Route  path="/edit/:id?" component={Edit} />
                        <Route component={NoMatch} />
                    </Switch> 
                </Router>
            </div>
        );
    }

}

ReactDOM.render(<Main />, root);