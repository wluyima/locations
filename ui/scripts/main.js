const root = document.querySelector('#root');
const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const dispatcher = new Flux.Dispatcher();

const BASE_URL = 'http://localhost:3000/api/locations';
const CHANGE_EVENT = 'change';

//Dispatcher, Actions , Stores, StoreListeners
class Store extends EventEmitter {
    constructor(){
        super();
        this._locations = [];   
    }
    addChangeListener(callback){
        this.on(CHANGE_EVENT, callback);
    }
    removeChangeListener(callback){
        this.removeListener(CHANGE_EVENT, callback);
    }
    emitChange(){
        this.emit(CHANGE_EVENT);
    }
    getLocations(){
        return this._locations;
    }
    setLocations(locations){
        this._locations = locations;
    }
}

store = new Store();

actions = {
    fireGetAll: function(){
        axios.get(BASE_URL)
        .then(function(response){
            dispatcher.dispatch({
                type: 'LOADED',
                payload: response.data
            });
        }).catch(function(err){
            console.error('ERROR:'+err);
        });
    }
}

dispatcher.register(function(action) {
    switch(action.type){
        case 'LOADED':
            store.setLocations(action.payload);
            //This line is the actually where the registration takes effect
            store.emitChange();
            break;
        default: 
            //Do nothing    
    }

});

//TODO use browserify so that require these from separate file rather than in same file
class Edit extends React.Component {
    constructor(){
        super();
        this.state = {
            location: {address: '', city: '', state: '', zipcode: ''},
            status: {address: {dirty: false}, city: {dirty: false}, state: {dirty: false}, zipcode: {dirty: false}},
            errors: {address: {required: true}, city: {required: true}, state: {required: true}, zipcode: {required: true}}
        };
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
        var propertyName = e.target.name;
        var value = e.target.value;
        //alternative away
        //this.state.location[propertyName] = value;
        //this.setState({location: this.state.location});
        this.setState({ ...this.state,
            location: { ...this.state.location, 
                [propertyName]: value 
            },
            status: { ...this.state.status, 
                [propertyName]: {  
                    dirty: true
                } 
            },
            errors: { ...this.state.errors, 
                [propertyName]: {
                    required: value.trim().length === 0 
                } 
            }
        });
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
    hasErrors() {
        var values = Object.values(this.state.errors);
        for (var i in values) {
            if(values[i].required){
                return true;
            }    
        }
        return false; 
    }
    render() {
        return (
            <EditForm location={this.state.location} changeHandler={this.updateLocation} saveHandler={this.save.bind(this)} 
                cancelHandler={this.cancel.bind(this)} errors={this.state.errors} status={this.state.status} 
                hasErrorsHandler={this.hasErrors.bind(this)} />    
        );
    }
}

function EditForm(props) {
    return (
        <form onSubmit={props.saveHandler} autoComplete='off'>
            <h2>{props.location.id ? 'Edit Location' : 'New Location'}</h2>
            <TextInput id={props.location.id} name="address" label="Address" value={props.location.address} changeHandler={props.changeHandler} size="50" errors={props.errors} status={props.status} />
            <TextInput id={props.location.id} name="city" label="City" value={props.location.city} changeHandler={props.changeHandler} size="30" errors={props.errors} status={props.status} />
            <TextInput id={props.location.id} name="state" label="State" value={props.location.state} changeHandler={props.changeHandler} size="30" errors={props.errors} status={props.status} />
            <TextInput id={props.location.id} name="zipcode" label="Zip Code" value={props.location.zipcode} changeHandler={props.changeHandler} size="30" errors={props.errors} status={props.status} />
            <p>
                <input type="submit" value="Save" disabled={props.hasErrorsHandler() && 'disabled'} />
                &nbsp;&nbsp;
                <button onClick={props.cancelHandler}>Cancel</button>
            </p>
        </form>
    );
}

function TextInput(props){
    return (
        <div>
            <b>{props.id && props.label}</b>
            <p>
                <input type="text" value={props.value} name={props.name} onChange={props.changeHandler}  
                    placeholder={props.label} size={props.size} />
            </p>
            <div className={!props.status[props.name].dirty || !props.errors[props.name].required ? 'hide' : undefined}>
                <span className="errors">{props.label} is required</span>
            </div>
        </div>
    );
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
            locations : store.getLocations() 
        };
        this._onLoaded = this._onLoaded.bind(this);
    }
    _onLoaded(){
        this.setState({ ...this.state, locations: store.getLocations() });    
    }
    componentWillMount(){
        store.addChangeListener(this._onLoaded);
    }
    componentDidMount(){
        actions.fireGetAll();
    }
    componentWillUnmount(){
        store.removeChangeListener(this._onLoaded);
    }
    add(){
        this.props.history.push('edit');
    }
    delete(loc){
        axios.delete(BASE_URL+'/'+loc.id)
            .then(function(){
                actions.fireGetAll();
            }).catch(function(err){
                console.error('ERROR:'+err);
            });
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
                        &nbsp;&nbsp;
                        <button onClick={this.delete.bind(this, loc)} title="Delete">Delete</button>
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