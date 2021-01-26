import $ from 'jquery'
import Str from './str'
import { WillPasteEvent, SquireEditor } from './squire'

const editorRoot = document.getElementById('squire') as HTMLElement
const editor = new window.Squire(editorRoot)

// SHOW SOURCE IN TEXTAREA
const copySourceToTextarea = () => {
  $('#editor-html').val(editor.getHTML())
}
editor.addEventListener('input', copySourceToTextarea)

// RTL
const checkRTL = (e: KeyboardEvent) => {
  if (e.key.length > 1) {
    return // Enter, Space, etc.
  }
  const container = editor.getSelection().commonAncestorContainer as HTMLElement
  if (container && container.textContent?.length === 0) {
    // ranges are taken from https://stackoverflow.com/a/19143254
    const ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF'
    const rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
    const ltrDirCheck = new RegExp('[' + ltrChars + ']')
    const rtlDirCheck = new RegExp('[' + rtlChars + ']')
    // Switch to LTR
    if (ltrDirCheck.test(e.key)) {
      container.setAttribute('dir', 'ltr')
    // Switch to RTL
    } else if (rtlDirCheck.test(e.key)) {
      container.setAttribute('dir', 'rtl')
    } else {
      // keep the previous direction for other characters and digits
    }
  }
}
editor.addEventListener('keydown', checkRTL)

// SET DEMO HTML
// editor.setHTML(`
// <h1>Installation</h1>
// <ol>
//   <li>Download the source from <a href="https://github.com/neilj/Squire">neilj/Squire</a></li>

//   <li>Copy the contents of the <code>build/</code> directory onto your server.</li>

//   <li>Edit the <code>&lt;style&gt;</code> block in <u>document.html</u> to add the default styles you <b>would</b> <i>like the editor</i> to use (or link  to an external stylesheet).</li>

//   <li>In your application, instead of a <code>&lt;textarea&gt;</code>, use an <code>&lt;iframe src="path/to/document.html"&gt;</code>.</li>

//   <li>In your JS, attach an event listener to the <code>load</code> event of the iframe. When this fires you can grab a reference to the editor object   through <code>iframe.contentWindow.editor</code>.</li>

//   <li>Use the API below with the <code>editor</code> object to set and get data and integrate with your application or framework.</li>
// </ol>
// `)
copySourceToTextarea()

const ua = navigator.userAgent
const isMac = /Mac OS X/.test(ua)
const ctrlKey = isMac ? 'meta-' : 'ctrl-'

let richTextMode = true
$('#rich-text').on('change', () => {
  richTextMode = $('#rich-text').is(':checked')

  if (!richTextMode) {
    const plainText = Str.htmlToText(editor.getHTML())
    editor.setHTML(Str.asEscapedHtml(plainText).replace(/\n/g, '<br>'))
    copySourceToTextarea()
  }
})

// PASTING IMAGES
// this is needed for 'drop' event to fire
editor.addEventListener('dragover', (e: DragEvent) => {
  e.preventDefault()
})
editor.addEventListener('drop', (e: DragEvent) => {
  if (!richTextMode) {
    return
  }
  if (!e.dataTransfer?.files.length) {
    return
  }
  const file = e.dataTransfer.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    editor.insertImage(reader.result as ArrayBuffer, {
      name: file.name
    })
  }
  reader.readAsDataURL(file)
})

editor.addEventListener('willPaste', (e: WillPasteEvent) => {
  if (richTextMode) { // allow all pastings in rich-text mode
    return
  }
  const plainTextDiv = document.createElement('div')
  plainTextDiv.appendChild(e.fragment)
  plainTextDiv.innerHTML = Str.asEscapedHtml(Str.htmlToText(plainTextDiv.innerHTML))
  while (e.fragment.firstChild) {
    e.fragment.firstChild.remove()
  }
  e.fragment.appendChild(plainTextDiv)
})

// SHORTCUTS
const mapKeyToFormat = (tag: string) => {
  return (self: SquireEditor, event: Event) => {
    event.preventDefault()
    if (!richTextMode) {
      return
    }
    const range = self.getSelection()
    if (self.hasFormat(tag, null)) {
      self.changeFormat(null, { tag: tag }, range)
    } else {
      self.changeFormat({ tag: tag }, null, range)
    }
  }
}
const noop = (self: SquireEditor, event: Event) => {
  event.preventDefault()
}
editor.setKeyHandler(ctrlKey + 'b', mapKeyToFormat('B'))
editor.setKeyHandler(ctrlKey + 'u', mapKeyToFormat('U'))
editor.setKeyHandler(ctrlKey + 'i', mapKeyToFormat('I'))
editor.setKeyHandler(ctrlKey + 'shift-7', noop) // default is 'S'
editor.setKeyHandler(ctrlKey + 'shift-5', noop) // default is 'SUB', { tag: 'SUP' }
editor.setKeyHandler(ctrlKey + 'shift-6', noop) // default is 'SUP', { tag: 'SUB' }
editor.setKeyHandler(ctrlKey + 'shift-8', noop) // default is 'makeUnorderedList'
editor.setKeyHandler(ctrlKey + 'shift-9', noop) // default is 'makeOrderedList'
editor.setKeyHandler(ctrlKey + '[', noop) // default is 'decreaseQuoteLevel'
editor.setKeyHandler(ctrlKey + ']', noop) // default is 'increaseQuoteLevel'
editor.setKeyHandler(ctrlKey + 'd', noop) // default is 'toggleCode'

// REMOVE FORMATTTING
document.querySelector('#remove-formatting')?.addEventListener('click', () => {
  editor.removeAllFormatting()
})
