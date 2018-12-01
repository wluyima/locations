const root = document.querySelector('#root');
const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;

const BASE_URL = 'http://localhost:3000/api/locations';

//TODO use browserify so that require these from separate file rather than in same file
class Edit extends React.Component {
    constructor(){
        super();
        this.state = {location: {address: '', city: '', state: '', zipcode: ''}};
        this.updateLocation = this.updateLocation.bind(this);
    }
    componentDidMount() {
        var component = this;
        if(this.props.match.params.id){
            axios.get(BASE_URL+'/'+this.props.match.params.id)
                .then(function(response){
                    component.setState({ ...component.state, location: response.data });
                }).catch(function(err){
                    console.error('ERROR:'+err);
                });
        }
    }
    updateLocation(e) {
        //alternative away
        //this.state.location[e.target.name] = e.target.value;
        //this.setState({location: this.state.location});
        this.setState({ ...this.state, location: { ...this.state.location, [e.target.name]: e.target.value } });
    }
    save(e) {
        e.preventDefault();
        var component = this;
        if(this.props.match.params.id) {
            axios.put(BASE_URL+'/'+this.props.match.params.id, this.state.location)
                .then(function(response){
                    component.setState({ ...component.state, location: response.data });
                    component.props.history.goBack();
                }).catch(function(err){
                    console.error('ERROR:'+err);
                });
        }else {
            axios.post(BASE_URL, this.state.location)
                .then(function(response){
                    component.setState({ ...component.state, location: response.data });
                    component.props.history.goBack();
                }).catch(function(err){
                    console.error('ERROR:'+err);
                });
        }
    }
    cancel(e) {
        e.preventDefault();
        this.props.history.goBack();
    }
    render() {
        return (
            <EditForm location={this.state.location} changeHandler={this.updateLocation} 
            saveHandler={this.save.bind(this)} cancelHandler={this.cancel.bind(this)} />    
        );
    }
}

class EditForm extends React.Component{
    render() {
        return (
            <form onSubmit={this.props.saveHandler}>
                <h2>{this.props.location.id ? 'Edit Location' : 'New Location'}</h2>
                <b>{this.props.location.id && 'Address'}</b>
                <p><input type="text" value={this.props.location.address} name="address" onChange={this.props.changeHandler} placeholder="Address" size="50" /></p>
                <b>{this.props.location.id && 'City'}</b>
                <p><input type="text" value={this.props.location.city} name="city" onChange={this.props.changeHandler} placeholder="City" size="30" /></p>
                <b>{this.props.location.id && 'State'}</b>
                <p><input type="text" value={this.props.location.state} name="state" onChange={this.props.changeHandler} placeholder="State" size="30" /></p>
                <b>{this.props.location.id && 'Code'}</b>
                <p><input type="text" value={this.props.location.zipcode} name="zipcode" onChange={this.props.changeHandler} placeholder="Zip Code" size="30" /></p>
                <p>
                    <input type="submit" value="Save" />
                    &nbsp;&nbsp;
                    <button onClick={this.props.cancelHandler}>Cancel</button>
                </p>
            </form>
        );
    }
}

function NoMatch() {
    return (
        <div>
            <h3>Page Not Fond</h3>
            <p><Link to="/">Home</Link></p>
        </div>
    );
}

class Locations extends React.Component {
    constructor(){
        super();
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

function Main() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact name="home" path="/" component={Locations} />
                    <Route name="edit" path="/edit/:id?" component={Edit} />
                    <Route component={NoMatch} />
                </Switch> 
            </Router>
        </div>
    );
}

ReactDOM.render(<Main />, root);