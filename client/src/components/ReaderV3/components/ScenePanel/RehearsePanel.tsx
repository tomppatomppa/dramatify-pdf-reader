import { useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import { useMutation } from 'react-query'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { AiOutlineSync } from 'react-icons/ai'
import { PlayIcon } from '../icons'
import { FaCircle, FaMicrophone } from 'react-icons/fa'

import { labelLines } from '../../utils'
import { Actor, Scene } from '../../reader.types'

import { useReaderContext } from '../../contexts/ReaderContext'
import { RootFolder, useRootFolder } from 'src/store/scriptStore'
import { createTextToSpeechFromScene } from 'src/API/googleApi'
import { useCurrentUser } from 'src/store/userStore'
import useAudio from '../../hooks/useAudio'
import usePlayAudio from '../../hooks/usePlayAudio'

import Modal from 'src/components/common/Modal'
import Spinner from 'src/components/common/Spinner'
import Message from 'src/components/common/Message'
import Dropdown from 'src/components/common/Dropdown'
import Wrapper from 'src/layout/Wrapper'
import SelectList from 'src/components/SelectList'

import PreviousScene from 'src/components/PreviousScene'
import { getSceneNumber } from 'src/utils/helpers'
import {
  RehearsalCommandBuilder,
  handleNextAction,
} from '../commands/RehersalPanelCommand'

const RehearsePanel = () => {
  const user = useCurrentUser()

  const rootFolder = useRootFolder() as RootFolder //Can be moved to useAudio?
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { values } = useFormikContext<Scene>()

  const { options, scriptId, dispatch } = useReaderContext()
  const { audioFiles, refetch, isFetching } = useAudio(
    values,
    scriptId,
    rootFolder.id
  )
  const { mutate, isError, isSuccess, isLoading } = useMutation(
    createTextToSpeechFromScene,
    {
      onSuccess: () => {
        refetch()
      },
    }
  )

  const uniqueActors = [
    ...new Set(values.data.map((line) => line.name || line.type)),
  ]

  const labeled = labelLines(values, options, audioFiles)

  if (user?.name === 'visitor') {
    return <div className="text-red-900">Not available in visitor mode</div>
  }

  return (
    <div className="flex md:gap-4 sm:mr-12 w-full">
      <Modal
        title="Create audio files for the scene?"
        content="This process will only take a couple
         seconds"
        show={showCreateModal}
        close={() => setShowCreateModal(false)}
        onAccept={() =>
          mutate({
            scriptId,
            scene: values,
            rootFolderId: rootFolder.id,
          })
        }
      >
        <Spinner show={isLoading} />
        <Message
          show={isSuccess}
          type="success"
          message={`Successfully added audio for ${values.id}`}
        />
        <Message
          show={isError}
          type="error"
          message={`Something went wrong while creating audio for ${values.id}`}
        />
      </Modal>
      <div className="flex flex-1 ">
        <button
          onClick={() => refetch()}
          className={`${isFetching ? 'text-gray-400 animate-spin' : ''} `}
        >
          <AiOutlineSync size={24} />
        </button>
      </div>
      <PreviousScene sceneId={getSceneNumber(values.id)} />
      <Dropdown title="Actors">
        <Wrapper>
          <SelectList
            labels={uniqueActors.map((actor) => ({
              label: actor,
              value: actor === 'INFO' ? '' : actor,
            }))}
            initialValues={options.highlight.map(
              (actor: Actor) => actor.id || ''
            )}
            onCheck={(label) =>
              dispatch({
                type: 'HIGHLIGHT_TARGET',
                payload: { target: label },
              })
            }
          />
        </Wrapper>
      </Dropdown>
      {audioFiles && !isFetching ? (
        <ComponentWhenValid values={values} labeled={labeled} />
      ) : (
        <button
          type="button"
          className="text-red-900 h-12"
          onClick={() => setShowCreateModal(true)}
        >
          Create
        </button>
      )}
    </div>
  )
}

interface ComponentWhenValidProps {
  values: Scene
  labeled: any[]
}

const ComponentWhenValid = ({ labeled }: ComponentWhenValidProps) => {
  const [start, setStart] = useState(false)

  //TODO: fix bugs || rethink the use of usePlayAudio
  const { audioRef, controls, setCurrentAudio } = usePlayAudio((audio) => {
    const currentIndex = labeled.findIndex((l) => l.src === audio)
    const nextLine = handleNextAction(labeled[currentIndex + 1])

    if (nextLine && currentIndex !== -1) {
      setCurrentAudio(nextLine?.src)
      SpeechRecognition.stopListening()
    } else {
      controls.stopAll()
      SpeechRecognition.startListening({
        language: 'sv-SE',
        continuous: true,
      })
    }
  })

  const commands = RehearsalCommandBuilder(labeled, (nextLine) => {
    if (nextLine) setCurrentAudio(nextLine.src)
  })

  const { listening } = useSpeechRecognition({
    commands,
  })

  const handleStart = () => {
    setStart(true)
    if (labeled[0].shouldPlay) {
      setCurrentAudio(labeled[0].src)
    } else {
      SpeechRecognition.startListening({
        language: 'sv-SE',
        continuous: true,
      })
    }
  }

  const handleStop = () => {
    setStart(false)
    controls.stopAll()
    setCurrentAudio(null)
  }

  const toggleMicrophone = () => {
    //Do not allow to start listening if audio is playing
    if (audioRef.current) return
    if (!listening) {
      SpeechRecognition.startListening({
        language: 'sv-SE',
        continuous: true,
      })
      return
    }
    SpeechRecognition.stopListening()
  }

  useEffect(() => {
    if (!start) return
    return () => {
      controls.stopAll()
      SpeechRecognition.stopListening()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  if (!start) {
    return (
      <button type="button" onClick={handleStart}>
        <PlayIcon />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button
        className={`${listening ? 'animate-pulse scale-125' : ''}`}
        onClick={toggleMicrophone}
      >
        <FaMicrophone color={`${listening ? 'green' : 'gray'}`} />
      </button>
      <button type="button" onClick={handleStop}>
        <FaCircle color="red" />
      </button>
    </div>
  )
}
export default RehearsePanel
