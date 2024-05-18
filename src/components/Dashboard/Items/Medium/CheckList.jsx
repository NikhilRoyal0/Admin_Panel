import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Text, Divider } from '@chakra-ui/react';

export default function CheckList() {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const tasks = [
        { id: 1, name: 'Task 1', status: 'In Progress', assignee: 'John Doe' },
        { id: 2, name: 'Task 2', status: 'Completed', assignee: 'Jane Smith' },
        { id: 3, name: 'Task 3', status: 'In Progress', assignee: 'Alice Johnson' },
        { id: 4, name: 'Task 4', status: 'Completed', assignee: 'Bob Brown' },
        { id: 5, name: 'Task 5', status: 'In Progress', assignee: 'Emily Davis' },
        { id: 6, name: 'Task 6', status: 'Completed', assignee: 'Michael Wilson' },
        { id: 7, name: 'Task 7', status: 'In Progress', assignee: 'Samantha Garcia' },
        { id: 8, name: 'Task 8', status: 'Completed', assignee: 'David Martinez' },
        { id: 9, name: 'Task 9', status: 'In Progress', assignee: 'Jennifer Rodriguez' },
        { id: 10, name: 'Task 10', status: 'Completed', assignee: 'Daniel Lee' },
        { id: 11, name: 'Task 11', status: 'In Progress', assignee: 'Melissa Taylor' },
        { id: 12, name: 'Task 12', status: 'Completed', assignee: 'Christopher Hernandez' },
    ];

    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelectedRows(tasks.map(task => task.id)); // Select all rows
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (id) => {
        const selectedIndex = selectedRows.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedRows, id];
        } else if (selectedIndex === 0) {
            newSelected = selectedRows.slice(1);
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = selectedRows.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selectedRows.slice(0, selectedIndex),
                ...selectedRows.slice(selectedIndex + 1),
            ];
        }

        setSelectedRows(newSelected);
    };

    return (
        <Box height="350px" overflowY="scroll" width="100%" css={{
            '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
                backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e0',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#a0aec0',
            }
        }}>
            <Text fontSize="xl" fontWeight="bold" mb="4">Checklist</Text>
            <Divider />
            <Table variant="striped" colorScheme="teal" >
                <Thead>
                    <Tr>
                        <Th>
                            <Checkbox isChecked={selectAll} onChange={handleSelectAll} />
                        </Th>
                        <Th>Task</Th>
                        <Th>Status</Th>
                        <Th>Assigned To</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tasks.map((task) => (
                        <Tr key={task.id}>
                            <Td>
                                <Checkbox
                                    isChecked={selectedRows.includes(task.id)}
                                    onChange={() => handleRowSelect(task.id)}
                                />
                            </Td>
                            <Td>{task.name}</Td>
                            <Td>{task.status}</Td>
                            <Td>{task.assignee}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </ Box>
    );
}
