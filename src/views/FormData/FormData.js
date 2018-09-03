import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  ModalBody,
  Row
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-responsive-modal';
import Table from 'rc-table';
import 'rc-table/assets/index.css';
import carNames from 'car-names';

class FormData extends Component {
  constructor(props) {
    super(props);
    this.state={
      carName: '' ,
      carNumber: '',
      color : 'black',
      sequence : [],
      parkingData: [],
      open : false,
      totalCar: '',
      parkingSpace: '',
      defaultValue : 0,
      slot: '',

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requiredDataGenerator = this.requiredDataGenerator.bind(this);
    this.createData = this.createData.bind(this);
  };
  componentDidMount() {
    // console.log(localStorage.getItem("parkingData"))
    if (localStorage.getItem("parkingData") == null) {
      this.setState({open : true });
    }
    if(localStorage.getItem("sequence")){
      this.setState({parkingData : JSON.parse(localStorage.getItem("parkingData"))})
      this.setState({sequence : JSON.parse(localStorage.getItem("sequence"))})
      this.setState({open: false});
    }
  }

  onCloseModal = () => {
      this.setState({ open: false });
    };
  remove(index) {
    const rows = this.state.sequence;
    const mainData = this.state.parkingData;
    const areaNo = rows[index].position;
    mainData[areaNo-1] = null;
    // mainData
    rows.splice(index, 1);

    this.setState({ //delete opertaion
      sequence: rows,
      parkingData : mainData,
    });
    localStorage.setItem('sequence',JSON.stringify(rows))
    localStorage.setItem('parkingData', JSON.stringify(mainData));
  }

  handleClick = index => () => {
    this.remove(index);
  };

  renderAction = (o, row, index) => {
    return (
      <Button type="delete" size="sm" color="danger" onClick={this.handleClick(index)}><i className="fa fa-ban"></i>Remove</Button>
    );
  };

  handleSubmit(event){
    //alert(this.state.url);
    event.preventDefault();
    var data1 = this.state.sequence;
    var data2 = this.state.parkingData;
    const selection = event.target.name;
    if(selection == 'submitPref'){
      var data = {};
      data.carName = this.state.carName;
      data.carNumber = this.state.carNumber;
      data.color = this.state.color;
      data.slot = this.state.slot;
      var nullPosition = data2.indexOf(null);
      if(nullPosition == -1){
        toast.error("Parking Space Full !", {
        position: toast.POSITION.TOP_CENTER
      })
    }
      if(nullPosition>=0){
      data.position = nullPosition + 1;
      data2[nullPosition] = data;
      data1.unshift(data);
      localStorage.setItem('sequence',JSON.stringify(data1))
      localStorage.setItem('parkingData', JSON.stringify(data2));
      this.setState({sequence : data1, parkingData : data2 })
    }
    };
    if(selection == 'submitIntialData'){
      var msg = this.requiredDataGenerator(this.state.parkingSpace, this.state.totalCar);
          this.setState({ open : false });
    
    }
    if(selection == 'resetMain'){
      this.setState({carName : '', carNumber: '', color: 'black', slot: '' })
    }
    if(selection == 'resetModal'){
      this.setState({totalCar:'', parkingSpace:''});
    }
  }

requiredDataGenerator(space,car){

    var carData = parseInt(car);
    var spaceData = parseInt(space);
    if(carData>spaceData){
    var carDataNew=spaceData;
    this.createData(spaceData,carDataNew)
    }
    if(carData<=spaceData){
    this.createData(carData,spaceData)
    }
  }
  createData(spaceData,carData){
    var car = carData;
    var space = spaceData;
    var parkingData= [];
    var sequence = [];
    parkingData.length = space;
    var color = ['black', 'blue', ' white', 'red'];
    const indexPosition = new Set();
    while(indexPosition.size != car) {
    indexPosition.add(Math.floor(Math.random() * space))
  }
  var position = [...indexPosition];
  // console.log(position);
      for(let i=0; i<car; i++){
        var data = {};
        data.carName = carNames.random();
        data.color = color[Math.floor(Math.random() * color.length)];
        data.slot = Math.floor(Math.random() * (24)) + 1;
        data.carNumber = 'KA-'+ Math.floor(Math.random() * 90 + 10) + '-'+('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')[(Math.floor(Math.random() * 26 ))]+('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')[(Math.floor(Math.random() * 26 ))] + '-'+ Math.floor(1000 + Math.random() * 9000);
        data.position = position[i] + 1;
        sequence.push(data);
        parkingData[position[i]] = data;
      }
      localStorage.setItem('sequence',JSON.stringify(sequence))
      localStorage.setItem('parkingData', JSON.stringify(parkingData));
      this.setState({sequence:sequence, parkingData: parkingData });
    return true;
  }

  handleChange(event){
    //console.log(this.state.parkingData);
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const {carName,carNumber,color} = this.state;
    if (fieldName == 'car'){
      this.setState({carName: fieldValue});
    }

    if (fieldName == 'number'){
      this.setState({carNumber: fieldValue});
    }
    if (fieldName == 'color'){
      this.setState({color: fieldValue});
    }
    if(fieldName == 'parkingSpace'){
      if(fieldValue>0){
        this.setState({parkingSpace : fieldValue});
      }

      // this.setState({})
    }
    if(fieldName == 'slot'){
      this.setState({slot : fieldValue});
    }
    if(fieldName == 'totalCar'){
      this.setState({totalCar : fieldValue});
    }

  }
  render() {
    //const state = this.state;
     const enabledBlend = (this.state.carName.length>0 && this.state.carNumber.length> 0 && this.state.slot.length>0);
      const columns = [
        { title: 'Car', dataIndex: 'carName', key: 'carName', width: 150 },
        { title: 'Registeration No.', dataIndex: 'carNumber', key: 'carNumber', width: 150 },
        { title: 'Color', dataIndex: 'color', key: 'color', width: 150 },
        { title: 'Slot', dataIndex: 'slot', key: 'slot', width: 150 },
        { title : 'Area No.', dataIndex:'position', key: 'position', width: 150 },
        { title: 'Action', dataIndex: '', key: 'x', render: this.renderAction },
    ];
    const scroll = {x: 500, y: 450}
    const { open } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
        <Col xs="11" sm="4">
          <Card>
            <CardHeader>
              <strong>Vechicle Input Form</strong>
            </CardHeader>
            <CardBody>
              <Form onSubmit={this.handleSubmit} className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="car">Car</Label>
                </Col>
                <Col sm="9">
                  <Input type="text" name="car" value={this.state.carName} onChange={this.handleChange.bind(this)} placeholder="Enter car name" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md= "3">
                  <Label htmlFor="number">Registeration Number</Label>
                </Col>
                <Col sm="9">
                  <Input type="text" name="number" value={this.state.carNumber} onChange={this.handleChange.bind(this)} placeholder="Enter Registeration Number" required />
                  <FormText className="help-block">Please enter Registeration in this format KA-01-HH-1234</FormText>
            </Col>
            </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Color</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="selectGender" onChange={this.handleChange.bind(this)} id="select">
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="blue">Blue</option>
                    <option value='red'>Red</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md = "3">
                  <Label htmlFor="slot">Slot</Label>
                </Col>
                <Col sm="9">
                  <Input type="number" name="slot" min={0} value={this.state.slot} onChange={this.handleChange.bind(this)} placeholder="Slot Allocated" required />
                </Col>
            </FormGroup>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" disabled = { !enabledBlend }  name="submitPref" onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="resetMain" size="sm" color="danger" name="reset" onClick={this.handleSubmit}><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" sm="8">
          <Table columns={columns} data={this.state.sequence} scroll ={scroll} height={100}rowKey={record => record.d} />
        </Col>
      </Row>
      <Modal open={open} onClose={this.onCloseModal} center>
          <ModalBody className="modalbodystyle">
            <Col>
              <Card>
                <CardBody>
                  <CardHeader>
                    <strong>Initial Input Form</strong>
                  </CardHeader>
                  <FormGroup>
                    <Label htmlFor="parkingSpace">Total Parking Space</Label>
                    <Input type="number" min={0} name="parkingSpace" onChange={this.handleChange.bind(this)} value={this.state.parkingSpace} placeholder="Enter number of Parking Space" required />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="totalCar">Total number of Car </Label>
                    <Input type="number" name="totalCar" onChange={this.handleChange.bind(this)} placeholder="Enter total numbe of car in parking lot" value={this.state.totalCar} required />
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </ModalBody>
          <Button type="resetModal" size="sm" color="danger" name="resetModal" onClick={this.handleSubmit}><i className="fa fa-ban"></i> Reset</Button>
          <Button className="float-right" name="submitIntialData" size="sm" color="success" onClick={this.handleSubmit}><i className="fa fa-ban"></i>Submit</Button>
        </Modal>
        <ToastContainer/>
      </div>
    );
  }
}

export default FormData;
