import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Button,
  HStack,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

const QualificationsModal = ({
  isOpen,
  onClose,
  qualifications,
  handleQualificationChange,
  addQualification,
  removeQualification,
}) => {
  const qualData = JSON.parse(qualifications)
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Qualifications</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {qualData.map((qualification, index) => (
              <Grid
                key={index}
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
                gap={4}
              >
                <FormControl>
                  <FormLabel>Qualification</FormLabel>
                  <Select
                    name="qualification"
                    value={qualification.qualification}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                {qualification.qualification === 'Other' && (
                  <FormControl>
                    <FormLabel>Highest Qualification</FormLabel>
                    <Input
                      type="text"
                      name="highestQualification"
                      value={qualification.highestQualification}
                      onChange={(e) => handleQualificationChange(index, e)}
                      required
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>College/School Name</FormLabel>
                  <Input
                    type="text"
                    name="collegeName"
                    value={qualification.collegeName}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Board University Name</FormLabel>
                  <Input
                    type="text"
                    name="boardUniversityName"
                    value={qualification.boardUniversityName}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={qualification.startDate}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={qualification.endDate}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Grade/Marks</FormLabel>
                  <Input
                    type="text"
                    name="gradeMarks"
                    value={qualification.gradeMarks}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Has Certificate?</FormLabel>
                  <Checkbox
                    name="hasCertificate"
                    isChecked={qualification.hasCertificate}
                    onChange={(e) => handleQualificationChange(index, e)}
                  />
                </FormControl>
                {qualification.hasCertificate && (
                  <>
                    <FormControl>
                      <FormLabel>Certificate No.</FormLabel>
                      <Input
                        type="text"
                        name="certificateNo"
                        value={qualification.certificateNo}
                        onChange={(e) => handleQualificationChange(index, e)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Issued By</FormLabel>
                      <Input
                        type="text"
                        name="issuedBy"
                        value={qualification.issuedBy}
                        onChange={(e) => handleQualificationChange(index, e)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Issue Date</FormLabel>
                      <Input
                        type="date"
                        name="issueDate"
                        value={qualification.issueDate}
                        onChange={(e) => handleQualificationChange(index, e)}
                        required
                      />
                    </FormControl>
                  </>
                )}
                {qualData.length > 1 && (
                  <HStack>
                    <Button
                      colorScheme="red"
                      onClick={() => removeQualification(index)}
                    >
                      Remove
                    </Button>
                  </HStack>
                )}
              </Grid>
            ))}
            {qualData.length < 5 && (
              <Button mt={4} colorScheme="green" onClick={addQualification}>
                Add Qualification
              </Button>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QualificationsModal;
