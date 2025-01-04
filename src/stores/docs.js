import { defineStore } from 'pinia'
import { documentation } from '../docs/content'

export const useDocsStore = defineStore('docs', {
  state: () => ({
    markdownContent: JSON.parse(JSON.stringify(documentation)),
    currentSection: 'overview',
    sections: [
      { id: 'overview', title: 'Overview' },
      { id: 'features', title: 'Features' },
      { id: 'security', title: 'Security' },
      { id: 'data-structures', title: 'Data Structures' },
      { id: 'architecture', title: 'Architecture' },
      { id: 'deployment', title: 'Deployment' },
      { id: 'development', title: 'Development' },
      { id: 'api', title: 'API Reference' }
    ],
    isEditing: false
  }),

  getters: {
    availableSections: (state) => state.sections,
    currentContent: (state) => state.markdownContent[state.currentSection] || '',
    navigationLinks: (state) => state.sections.map(section => ({
      id: section.id,
      title: section.title,
      isActive: section.id === state.currentSection
    }))
  },

  actions: {
    setContent(section, content) {
      this.markdownContent[section] = content
    },
    
    setCurrentSection(section) {
      if (this.sections.some(s => s.id === section)) {
        this.currentSection = section
      }
    },

    toggleEditing() {
      this.isEditing = !this.isEditing
    },

    getCurrentContent() {
      return this.markdownContent[this.currentSection] || ''
    },

    reset() {
      this.markdownContent = JSON.parse(JSON.stringify(documentation))
      this.currentSection = 'overview'
      this.isEditing = false
    }
  },

  persist: {
    key: 'docs-store',
    storage: localStorage,
    paths: ['markdownContent', 'currentSection', 'isEditing']
  }
})
