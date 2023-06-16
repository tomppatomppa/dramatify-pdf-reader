import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ScriptList from './ScriptList'
import { Script } from './ReaderV3/reader.types'
const scripts = [
  {
    filename: 'Episode_s01e77__TI_vecka_16_2023_-_Dramatify.pdf',
    id: '35a2f575-6fff-4f93-b3c2-5e17f0235b31',
    scenes: [
      {
        id: 'SCRIPT DETAILS',
        data: [{ id: 1, type: 'INFO', name: '', lines: '' }],
      },
      {
        id: '7701 INT. KÄLLAREN',
        data: [{ id: 2, type: 'INFO', name: '', lines: '' }],
      },
    ],
  },
  {
    filename: 'Episode_2.pdf',
    id: '12345678-6fff-4f93-b3c2-5e17f0235b31',
    scenes: [
      {
        id: 'SCRIPT DETAILS',
        data: [{ id: 1, type: 'INFO', name: '', lines: '' }],
      },
      {
        id: '9701 INT. INTERIOR',
        data: [{ id: 2, type: 'INFO', name: '', lines: '' }],
      },
    ],
  },
] as unknown as Script[]

test('renders correct number of list items', async () => {
  render(
    <ScriptList
      scripts={scripts}
      activeScriptId=""
      setActiveScript={() => {}}
      deleteScript={() => {}}
    />
  )

  expect(await screen.findAllByRole('listitem')).toHaveLength(scripts.length)
})

test('should call setActiveScript with the correct id', async () => {
  const setActiveScript = jest.fn()
  render(
    <ScriptList
      scripts={scripts}
      activeScriptId=""
      setActiveScript={setActiveScript}
      deleteScript={() => {}}
    />
  )

  const listItems = await screen.findAllByRole('listitem')
  userEvent.click(listItems[0])
  expect(setActiveScript).toBeCalledWith(scripts[0].id)
})

test('should call deleteScript with the correct id', async () => {
  const deleteScript = jest.fn()
  render(
    <ScriptList
      scripts={scripts}
      activeScriptId=""
      setActiveScript={() => {}}
      deleteScript={deleteScript}
    />
  )

  const buttons = await screen.findAllByRole('button')
  fireEvent.click(buttons[0])
  expect(deleteScript).toBeCalledWith(scripts[0].id)
})