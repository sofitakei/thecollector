import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from '@mui/material'

const questions = [
  { question: 'How awesome is this product?' },
  { question: 'Is it easy to use?' },
  { question: 'How can I give you lots of money?' },
  { question: 'What are the different tiers of service?' },
]

const FAQ = () => (
  <>
    <Typography variant='h1'>Frequently Asked Questions</Typography>

    <Stack
      my={4}
      mx='auto'
      sx={{
        width: {
          xs: '100%',
          sm: '80%',
        },
        textAlign: 'left',
      }}>
      {questions.map(({ question }, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {question}
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  </>
)

export default FAQ
