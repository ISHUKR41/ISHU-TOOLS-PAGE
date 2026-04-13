import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, Image, Wand2, Zap, Shield, Globe,
  ArrowRight, Star, Users, Clock
} from 'lucide-react';

const categories = [
  {
    id: 'pdf-core',
    title: 'PDF Tools',
    description: 'Merge, split, compress, and convert PDFs',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    toolCount: 80
  },
  {
    id: 'image-core',
    title: 'Image Tools',
    description: 'Resize, compress, convert, and enhance images',
    icon: Image,
    color: 'from-purple-500 to-pink-500',
    toolCount: 70
  },
  {
    id: 'ocr-vision',
    title: 'OCR & AI',
    description: 'Extract text, remove backgrounds, blur faces',
    icon: Wand2,
    color: 'from-green-500 to-emerald-500',
    toolCount: 15
  },
  {
    id: 'batch-automation',
    title: 'Batch Tools',
    description: 'Process multiple files at once',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    toolCount: 20
  },
  {
    id: 'pdf-security',
    title: 'Security',
    description: 'Protect, unlock, and redact PDFs',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    toolCount: 10
  },
  {
    id: 'text-ops',
    title: 'Text Tools',
    description: 'Word count, translate, summarize',
    icon: Globe,
    color: 'from-indigo-500 to-blue-500',
    toolCount: 20
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process files in seconds with optimized algorithms'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your files are processed securely and deleted after'
  },
  {
    icon: Users,
    title: 'No Registration',
    description: 'Use all tools without creating an account'
  },
  {
    icon: Clock,
    title: '24/7 Available',
    description: 'Access tools anytime, anywhere, on any device'
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold">
              200+ Tools Available
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ISHU TOOLS
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your all-in-one toolkit for PDF, image, and document processing.
            Fast, secure, and completely free.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/tools"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              Explore Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#categories"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Tools', value: '200+' },
              { label: 'Users', value: '1M+' },
              { label: 'Files Processed', value: '10M+' },
              { label: 'Rating', value: '4.9★' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Category
            </h2>
            <p className="text-gray-400 text-lg">
              Select from our wide range of professional tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link
                  to={`/category/${category.id}`}
                  className="block p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-400 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.toolCount} tools
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose ISHU TOOLS?
            </h2>
            <p className="text-gray-400 text-lg">
              Built with modern technology for the best experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12"
        >
          <Star className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions of users who trust ISHU TOOLS for their daily tasks
          </p>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Start Using Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-4">© 2024 ISHU TOOLS. All rights reserved.</p>
          <p className="text-sm">
            Made with ❤️ for everyone who needs powerful, free tools
          </p>
        </div>
      </footer>
    </div>
  );
}
