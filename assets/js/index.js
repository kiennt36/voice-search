const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const searchForm = $('#form-search')
const searchFormInput = $('#form-search .text-search')
const SpeechRecognition = 
		window.SpeechRecognition || window.webkitSpeechRecognition

const app = {
	micBtn: undefined,
	micIcon: undefined,
	recognition: undefined,
	transcript: '',
	textVoiceList: [],

	addVoiceBtn: function () {
		if(SpeechRecognition) {
			console.log('Your Browser supports speech Recognition.')
			searchForm.insertAdjacentHTML('beforeend', '<button type="button" class="voice-btn"><i class="fas fa-microphone"></i></button>')
			this.micBtn = $('#form-search .voice-btn')
			this.micIcon = $('#form-search .voice-btn i')
			this.recognition = new webkitSpeechRecognition() || new SpeechRecognition()
		}
		else {
			alert('Your Browser does not support speech Recognition.')
		}
	},

	handleEvents: function () {
		const _this = this

		this.recognition.lang = 'vi-VN'
		this.recognition.continuous = true

		this.micBtn.onclick = function () {
			_this.micBtnClick()
		}

		this.recognition.onstart = function () {
			_this.startSpeechRecognition()
		}

		this.recognition.onspeechend = function(event) {
			console.log('Sound has stopped being received');
		}

		this.recognition.onend = function () {
			_this.endSpeechRecognition()

			if(searchFormInput.value !== "") {
				setTimeout(function () {
					searchForm.submit()
				}, 750)
			}
			else {
				searchFormInput.placeholder = "Không thể nhận diện giọng nói, vui lòng đọc lại!"
			}
		}

		this.recognition.onresult = function (events) {
			_this.resultOfSpeechRecognition(events)

			if(_this.textVoiceList.length > 0)
				searchFormInput.value = _this.textVoiceList.join('')
			else
				searchFormInput.value = ""
		}

	},

	micBtnClick: function () {
		if (this.micIcon.classList.contains('fa-microphone')) {
			this.recognition.start()
		}
		else {
			this.recognition.stop()
		}
	},

	startSpeechRecognition: function () {
		console.log('Speech Recognition Active')
		searchFormInput.focus()
		searchFormInput.placeholder = "Search Google..."
		this.micIcon.classList.remove('fa-microphone')
		this.micIcon.classList.add('fa-microphone-slash')
		this.micIcon.classList.add('active')
	},

	endSpeechRecognition: function () {
		console.log('Speech Recognition Disabled')
		searchFormInput.focus()
		this.micIcon.classList.add('fa-microphone')
		this.micIcon.classList.remove('fa-microphone-slash')
		this.micIcon.classList.remove('active')
	},

	resultOfSpeechRecognition: function (e) {
		let newTextVoiceList = []
		const currentIndex = e.resultIndex

		this.textVoiceList[currentIndex] = 
			e.results[currentIndex][0].transcript

		if(this.textVoiceList.length > 1) {
			if(
				this.textVoiceList[currentIndex].toLowerCase().trim() === "đi" ||
				this.textVoiceList[currentIndex].toLowerCase().trim() === "go"
			) {
				newTextVoiceList = this.textVoiceList.filter(value => {
					return value.toLowerCase().trim() !== "đi" && value.toLowerCase().trim() !== "go"
				})
				this.textVoiceList = newTextVoiceList
				this.micBtnClick()
			}
			else if(
				this.textVoiceList[currentIndex].toLowerCase().trim() === "làm mới" ||
				this.textVoiceList[currentIndex].toLowerCase().trim() === "clear"
			)
				this.textVoiceList = []
		}
	},

	start: function () {
		this.addVoiceBtn()
		this.handleEvents()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	app.start()
})