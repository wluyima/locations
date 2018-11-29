const root = document.querySelector('#root');
const BASE_URL = 'http://localhost:3000/api/locations'

//TODO use browserify so that require these from separate file rather than in same file
class Edit extends React.Component{ 
    render() {
        return (
            <div>
                <h2>Title</h2>
                <div>Address</div>
                <div>City</div>
                <div>State</div>
                <div>Zipcode</div>
            </div>
        );
    }
}

class Locations extends React.Component{
    render(){
        var locations = this.props.locations.map((loc) => {
            return (
                <tr key={loc.id}>
                    <td>{loc.address}</td>
                    <td>{loc.city}</td>
                    <td>{loc.state}</td>
                    <td>{loc.zipcode}</td>
                    <td>
                        <a className="link" title="Edit">Edit</a>
                        &nbsp;
                        <a className="link" title="Delete">Delete</a>
                    </td>
                </tr>
            );
        });
        
        return (
            <div>
                <h2>Locations</h2>
                <p><button>Add New Location</button></p>
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

    render() {
        return (
            <div>
                <Locations locations={this.state.locations} />    
            </div>
        );
    }
}

ReactDOM.render(<Main />, root);