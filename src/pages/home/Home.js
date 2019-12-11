import React, { Component } from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';

export class Home extends Component {
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
                accessor: 'important'
            },
            {
                Header: 'Ne Zamana Kadar?',
                accessor: 'date'
            }

        ]

        this.state = {
            data: [
                {
                    title: "Toyota",
                    description: "Toyota projesi tamamlanacak",
                    important: 10,
                    date: "25.01.2019"
                }
            ],
        }
    }

    render() {
        return (
            <div>
                <button>Yapılacaklar</button>
                <button>Yapılıyor</button>
                <button>Tamamlandı</button>

                <ReactTable 
                    columns={this.columns} 
                    data={this.state.data}
                    // filterable={true}
                    pageSize={10}
                />
            </div>
        )
    }
}
