// export const TaskTable = ({taskData, handleDelete}) =>
// {
// const task_columns = [
//   {
//     title: 'Task Name',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: 'Scheme',
//     dataIndex: 'scheme',
//     key: 'scheme',
//   },
//   {
//     title: 'Date',
//     dataIndex: 'date',
//     key: 'date',
//   },
//   {
//     title: 'Comm Rounds',
//     dataIndex: 'commRounds',
//     key: 'commRounds',
//   },
//   {
//     title: 'Total clients',
//     dataIndex: 'clients',
//     key: 'clients',
//   },
//   {
//     title: 'Client Fraction',
//     dataIndex: 'fraction',
//     key: 'fraction',
//   },

//   {
//     title: 'Remove',
//     key: 'remove',
//     dataIndex: 'remove',
//     render: (text, record) => (
//      <button onClick={()=> handleDelete(record)}>
//        {"Button Text"}
//      </button>
//     ),
//   },
// ];

//   return 
// }


export const scheme_columns = [
  {
    title: 'Task Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Optimizer',
    dataIndex: 'optimizer',
    key: 'optimizer',
  },
  {
    title: 'Loss',
    dataIndex: 'loss',
    key: 'loss',
  },
  {
    title: 'Minibatch Size',
    dataIndex: 'minibatch',
    key: 'minibatch',
  },
  {
    title: 'Test Minibatch Size',
    dataIndex: 'testMinibacth',
    key: 'testMinibacth',
  },
  {
    title: 'Learning rate',
    dataIndex: 'learningRate',
    key: 'learningRate',
  },
  {
    title: 'Local epochs',
    dataIndex: 'epoch',
    key: 'epoch',
  },
  {
    title: 'Compression',
    dataIndex: 'compress',
    key: 'compress',
  },
];

export const dashboard_columns = [{
  title: 'Comm Rounds',
  dataIndex: 'rounds',
  key: 'rounds',
},
{
  title: 'Local epoch Number',
  dataIndex: 'epoch',
  key: 'epoch',
},
{
  title: 'Local minibatch size',
  dataIndex: 'minibatch',
  key: 'minibatch',
},
{
  title: 'Test Minibatch Size',
  dataIndex: 'tminibatch',
  key: 'tminibatch',
},

{
  title: 'Learning rate',
  dataIndex: 'learningRate',
  key: 'learningRate',
},
{
  title: 'Active Clients',
  dataIndex: 'clients',
  key: 'clients',
},
{
  title: 'Client fraction',
  dataIndex: 'fraction',
  key: 'fraction',
},
]