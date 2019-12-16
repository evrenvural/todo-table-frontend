import React, { Component } from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import { 
    Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, 
    InputGroupText, Input, FormGroup
} from 'reactstrap';
import moment from 'moment';
import { fetchTodos, addTodo } from '../../redux/actions/todos';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(){
        super();

        this.columns = [
            {
                Header: 'Başlık',
                accessor: 'title'
            },
            {
                Header: 'Tanım',
                accessor: 'description',
            },
            {
                Header: 'Önem Değeri (1, 10)',
                accessor: 'importantValue'
            },
            {
                Header: 'Ne Zamana Kadar?',
                accessor: 'date'
            }

        ]

        this.state = {
            addTodo: {
                inputModalVisual: false,
                sureModalVisual: false,
                isSuccess: false,
                isFailed: false,
                isRequesting: false,
                data: {
                    title: '',
                    description: '',
                    importantValue: '1',
                    date: moment(new Date().getTime()).format('YYYY-MM-DD')
                }
            }
        }
    }

    componentDidMount(){
        this.props.getTodos();
    }

    componentDidUpdate(){
        if (this.state.addTodo.isRequesting && !this.props.todo.isLoading) {
            if (this.props.todo.error) {
                this.setState(prevState => ({
                    addTodo: { ...prevState.addTodo,
                        inputModalVisual: false,
                        sureModalVisual: false,
                        isSuccess: false,
                        isRequesting: false,
                        isFailed: true
                    }
                }));
            } 
            else {
                this.setState(prevState => ({
                    addTodo: { ...prevState.addTodo,
                        inputModalVisual: false,
                        sureModalVisual: false,
                        isSuccess: true,
                        isRequesting: false,
                        isFailed: false
                    }
                }));
            }
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        const aim = (event.target.name).split(".");

        this.setState(prevState => ({
            [aim[0]]: { ...prevState[aim[0]],
                data: { ...prevState[aim[0]].data,
                    [aim[1]]: value
                }
            }
        }));
    };

    handleDateChange = (event) => {
        const value = event.target.value;
        const aim = (event.target.name).split(".");

        const convertToDoubleFromDate = (dateString) => {
            const date = new Date(dateString);
            return date.getTime();
        }

        this.setState(prevState => ({
            [aim[0]]: { ...prevState[aim[0]],
                data: { ...prevState[aim[0]].data,
                    [aim[1]]: convertToDoubleFromDate(value)
                }
            }
        }));
    }

    toggleInputModalAddTodo = () => {
        this.setState(prevState => ({
            addTodo: { ...prevState.addTodo, inputModalVisual: !this.state.addTodo.inputModalVisual }
        }));
    }
    toggleSureModalAddTodo = () => {
        this.setState(prevState => ({
            addTodo: { ...prevState.addTodo, 
                inputModalVisual: !this.state.addTodo.inputModalVisual,
                sureModalVisual: !this.state.addTodo.sureModalVisual 
            }
        }));
    }
    addTodoPress = (data) => {
        this.props.todoAdd(data);

        this.setState(prevState => ({
            addTodo: { ...prevState.addTodo,
                inputModalVisual: false,
                isRequesting: true,
                data: {
                    title: '',
                    description: '',
                    importantValue: '1',
                    date: moment(new Date().getTime()).format('YYYY-MM-DD')
                }
            }
        }));
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.addTodo.inputModalVisual} toggle={this.toggleInputModalAddTodo}
                    className={'modal-warning ' + this.props.className}>
                    
                    <ModalHeader toggle={this.toggleInputAddModalTodo}>Promocode</ModalHeader>
                    
                    <ModalBody>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>No</InputGroupText>
                            </InputGroupAddon>
                            <Input
                                name="addTodo.title" 
                                placeholder="Title"
                                onChange={this.handleChange}
                                value={this.state.addTodo.data.title} 
                            />
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>No</InputGroupText>
                            </InputGroupAddon>
                            <Input
                                name="addTodo.description" 
                                placeholder="Description"
                                onChange={this.handleChange}
                                value={this.state.addTodo.data.description} 
                            />
                        </InputGroup>
                        <br />
                        <FormGroup>
                            <Input type="select" name="addTodo.importantValue" onChange={this.handleChange}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </Input>
                        </FormGroup>
                        <InputGroup>
                            <Input
                                name="addTodo.date"
                                type="date"
                                onChange={this.handleDateChange}
                                value={moment(this.state.addTodo.data.date).format('YYYY-MM-DD')}
                                />
                        </InputGroup>
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.toggleSureModalAddTodo()}>Gönder</Button>{' '}
                        <Button color="secondary" onClick={this.toggleInputModalAddTodo}>Vazgeç</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.addTodo.sureModalVisual} toggle={this.toggleSureModalAddTodo}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalAddTodo}>Make Free</ModalHeader>
                    
                    <ModalBody>
                        promocode'u göndermek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.addTodoPress(this.state.addTodo.data)}>Onayla</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalAddTodo}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.addTodo.isRequesting}
                    className={'modal-info ' + this.props.className}>
                    
                    <ModalHeader>Bilgilendirme</ModalHeader>
                    
                    <ModalBody>
                        İşleminiz gerçekleştiriliyor. Lütfen bekleyiniz...
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.addTodo.isSuccess}
                    className={'modal-success ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Başarılı</ModalHeader>
                    
                    <ModalBody>
                        Promocode başarılı bir şekilde gönderilmiştir.
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            color="success"
                            onClick={() => this.setState(prevState => ({ addTodo: {...prevState.addTodo, isSuccess: false } }))}>
                                Tamam
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.addTodo.isFailed}
                    className={'modal-danger ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Hatalı</ModalHeader>
                    
                    <ModalBody>
                        Promocode gönderilirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ addTodo: { ...prevState.addTodo, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <button>Yapılacaklar</button>
                <button>Yapılıyor</button>
                <button>Tamamlandı</button>
                <button onClick={this.toggleInputModalAddTodo}>Todo Ekle</button>

                <ReactTable 
                    columns={this.columns} 
                    data={this.props.todo}
                    // filterable={true}
                    pageSize={10}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    todo: state.todos.todos
});

const mapDispatchToProps = (dispatch) => ({
    getTodos: () => fetchTodos(dispatch),
    todoAdd: (data) => addTodo(dispatch, data)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
