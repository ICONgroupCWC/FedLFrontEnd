import { Table } from "antd";
import { DeleteTwoTone} from "@ant-design/icons";

export const TaskTable = ({ taskData, handleDelete }) => {
    const task_columns = [
        {
            title: 'Task Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Scheme',
            dataIndex: 'scheme',
            key: 'scheme',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Comm Rounds',
            dataIndex: 'commRounds',
            key: 'commRounds',
        },
        {
            title: 'Total clients',
            dataIndex: 'clients',
            key: 'clients',
        },
        {
            title: 'Client Fraction',
            dataIndex: 'fraction',
            key: 'fraction',
        },

        {
            title: 'Remove',
            key: 'remove',
            dataIndex: 'remove',
            render: (text, record) => (
                <button onClick={() => handleDelete(record)}>
                    {<DeleteTwoTone />}
                </button>
            ),
        },
    ];

    return (
        <Table
            pagination={false}
            bordered
            dataSource={taskData} columns={task_columns} />
    )
}