import * as Game from './game'
import { Board } from './board'
import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('.section-canvas') as HTMLCanvasElement
  if (!canvas) {
    console.error('Canvas element not found')
    return
  }

  const initScreenDOM = document.querySelector('.init-screen') as HTMLDialogElement
  if (!initScreenDOM) {
    console.error('Mode element not found')
    return
  }

  const board = new Board(canvas)
  board.render()

  const searchParams = new URLSearchParams(location.search)
  const connectionMatchId = searchParams.get('matchId')
  const backToModeSelector = document.querySelector(
    '.statusbox-button-back'
  ) as HTMLDivElement

  const settingsForm = document.querySelector(
    '.game-settings-form'
  ) as HTMLFormElement

  if (!settingsForm) {
    console.error('.game-settings-form not found')
    return
  }

  // Remove references to player name labels/inputs
  // (Because we've deleted them from the HTML)
  //
  // Example:
  // const player1NameLabel = settingsForm.querySelector('.game-settings-player-1-name-label') as HTMLLabelElement
  // const player2NameLabel = settingsForm.querySelector('.game-settings-player-2-name-label') as HTMLLabelElement
  // const player1NameInput = settingsForm.querySelector('.game-settings-player-1-name-input') as HTMLInputElement
  // const player2NameInput = settingsForm.querySelector('.game-settings-player-2-name-input') as HTMLInputElement
  // -- all removed --

  let currentGameHandler: { end: () => void } | undefined | null = null

  backToModeSelector?.classList.add('hidden')
  initScreenDOM.showModal()

  // If you really want only AI vs AI mode, you can ignore this 'chosenMode' logic
  let chosenMode: string = !!connectionMatchId ? 'online-human' : 'ai-vs-ai'

  // (Optional) If you want to lock to ai-vs-ai, you can override:
  // chosenMode = 'ai-vs-ai'

  // If you keep multiple modes, you can keep using 'renderForm()' or remove it.
  renderForm()

  backToModeSelector?.addEventListener('click', () => {
    if (currentGameHandler && currentGameHandler.end) {
      currentGameHandler.end()
    }
    backToModeSelector?.classList.add('hidden')
    initScreenDOM.showModal()
  })

  initScreenDOM.addEventListener('cancel', (ev) => {
    ev.preventDefault()
  })

  initScreenDOM.addEventListener('close', (ev) => {
    const formData = new FormData(settingsForm)
    const gameMode = formData.get('mode') as string
    // Hardcode the two AI names here
    // We'll just ignore any "player name" since we removed the inputs
    const firstPlayerName = 'GPT-4o'
    const secondPlayerName = 'Claude 3.5 Sonnet'
    initGame(gameMode, [firstPlayerName, secondPlayerName])
  })

  // If you keep multiple modes, you can still respond to user input changes:
  settingsForm.addEventListener('input', (ev) => {
    const formData = new FormData(settingsForm)
    chosenMode = formData.get('mode') as string
    renderForm()
  })

  // Minimal version of renderForm() - we either remove it or keep only what we need
  function renderForm() {
    // If you truly only want AI vs AI, you could no-op this function
    // or remove it entirely.
    //
    // For demonstration, we'll just do nothing:
    return
  }

  function initGame(chosenMode: string | null, playerNames: (string | null)[]) {
    console.log('initGame chosenMode:', chosenMode)
    backToModeSelector?.classList.remove('hidden')

    if (chosenMode === 'ai-vs-ai') {
      // Hardcode your two AI names
      // (If Game.initGameAiVsAi() doesn’t accept arguments,
      //  make sure it does, or set them inside that function.)
      currentGameHandler = Game.initGameAiVsAi(
        playerNames[0] || 'GPT-4o',
        playerNames[1] || 'Claude 3.5 Sonnet'
      )
    } else if (chosenMode === 'offline-human') {
      // etc. (remove this if you only want ai-vs-ai)
      currentGameHandler = Game.initGameLocal2p('Player 1', 'Player 2')
    } else if (chosenMode === 'offline-ai') {
      currentGameHandler = Game.initGameLocalAi('Player 1')
    } else if (chosenMode === 'online-human') {
      currentGameHandler = Game.initGameOnline2p(
        connectionMatchId ? 'Player 2' : 'Player 1'
      )
    } else {
      console.error('Invalid game mode received', chosenMode)
    }
  }
})
