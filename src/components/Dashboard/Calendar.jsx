import React, { useState } from "react";
import Calendar from "react-calendar";

import { Text, Icon, Box } from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function MiniCalendar(props) {
  const { selectRange, ...rest } = props;
  const [value, onChange] = useState(new Date());
  
  return (
    <Box
      align='center'
      w='420px'  
      h='400px' 
      fontSize={20} 
      {...rest}>
      <Calendar
        onChange={onChange}
        value={value}
        selectRange={selectRange}
        view={"month"}
        tileContent={<Text p={2}  color='brand.500' ></Text>}
        prev2Label={<Icon as={MdChevronLeft} w='40px' h='40px' mt={2} />}
        next2Label={<Icon as={MdChevronRight} w='40px' h='40px' mt={2} />}
        prevLabel={<Icon as={MdChevronLeft} w='40px' h='40px'  mt={2}/>}
        nextLabel={<Icon as={MdChevronRight} w='40px' h='40px' mt={2}/>}
        className="react-calendar"
      />
    </Box>
  );
}
