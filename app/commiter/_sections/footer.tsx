import { Github, Linkedin, Youtube, Presentation } from "lucide-react"

export const Footer = () => {
    return (
        <footer className="bg-orange-500 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white text-sm">&copy; {new Date().getFullYear()} Ryan Misaghi</p>
              <div className="flex space-x-6">
                <a href="https://www.misaqi.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-200 transition-colors">
                  <Presentation size={20} />
                  <span className="sr-only">Website</span>
                </a>
                <a href="https://www.youtube.com/mawsyh" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-200 transition-colors">
                  <Youtube size={20} />
                  <span className="sr-only">YouTube</span>
                </a>
                <a href="https://www.linkedin.com/in/mawsyh" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-200 transition-colors">
                  <Linkedin size={20} />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href="https://github.com/mawsyh" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-200 transition-colors">
                  <Github size={20} />
                  <span className="sr-only">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
    )
}