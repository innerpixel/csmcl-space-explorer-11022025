import { defineStore } from 'pinia'

export const useDocsStore = defineStore('docs', {
  state: () => ({
    markdownContent: {},
    currentSection: null,
    isEditing: false
  }),

  actions: {
    setContent(section, content) {
      this.markdownContent[section] = content
    },
    
    setCurrentSection(section) {
      this.currentSection = section
    },

    toggleEditing() {
      this.isEditing = !this.isEditing
    },

    getCurrentContent() {
      return this.markdownContent[this.currentSection] || ''
    }
  },

  persist: true
})
