import React, { useState, useEffect } from 'react';
import {
    GridItem,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
    IconButton,
    Flex,
    Box,
    CloseButton,
} from '@chakra-ui/react';
import { MdArrowDropDown } from 'react-icons/md';

const ModuleSelect = ({ formData, setFormData, isEditing, moduleData }) => {
    const initialSelectedModules = formData.module ? JSON.parse(formData.module) : [];
    const [selectedModules, setSelectedModules] = useState(initialSelectedModules);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setFormData({
            ...formData,
            module: JSON.stringify(selectedModules),
        });
    }, [selectedModules, setFormData, formData]);

    const toggleModuleSelection = (module) => {
        const newSelectedModules = isSelected(module)
            ? selectedModules.filter(selected => selected.moduleId !== module.moduleId)
            : [...selectedModules, module];
        
        setSelectedModules(newSelectedModules);
    };

    const isSelected = (module) => {
        const found = selectedModules.some(selected => selected.moduleId === module.moduleId);
        return found;
    };

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && isEditing) {
            setSelectedModules(initialSelectedModules);
        }
    };

    const removeModule = (module) => {
        const updatedModules = selectedModules.filter(selected => selected.moduleId !== module.moduleId);
        setSelectedModules(updatedModules);
    };

    return (
        <GridItem colSpan={2}>
            <Text mb={2} fontWeight="bold">Module</Text>

            <Flex flexDirection="column" alignItems="flex-start">
                <Menu isOpen={isOpen && isEditing} onClose={() => setIsOpen(false)}>
                    <MenuButton
                        as={IconButton}
                        icon={<Text m={5} display="flex">Select module <MdArrowDropDown style={{ marginLeft: "5px" }} size={25} /></Text>}
                        variant="outline"
                        size="md"
                        aria-label="Select module"
                        maxWidth={200}
                        isDisabled={!isEditing}
                        onClick={handleMenuToggle}
                    >
                        Select module
                    </MenuButton>
                    <MenuList minWidth="240px">
                        {moduleData.map(module => (
                            <MenuItem key={module.moduleId}>
                                <Checkbox
                                    mr={2}
                                    isChecked={isSelected(module)}
                                    onChange={() => toggleModuleSelection(module)}
                                    isDisabled={!isEditing}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {module.title}
                                </Checkbox>
                                {isSelected(module) && (
                                    <Text>{module.module}</Text>
                                )}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                <Box border="1px solid" borderColor="gray.300" p={3} borderRadius="md" mt={3} width="100%">
                    <Flex flexWrap="wrap" mt={1}>
                        {selectedModules.map(module => (
                            <Flex key={module.moduleId} alignItems="center" mr={2} mb={2} bg="gray.100" p={2} borderRadius="md">
                                <Text>{module.title}</Text>
                                {isEditing && <CloseButton ml={2} onClick={() => removeModule(module)} />}
                            </Flex>
                        ))}
                    </Flex>
                </Box>
            </Flex>
        </GridItem>
    );
};

export default ModuleSelect;
