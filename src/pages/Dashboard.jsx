import Footer from '../components/footer'
import MainContent from '../components/MainContent'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-[300px] overflow-y-auto">
          <MainContent />
          <Footer />
        </div>
      </div>
    </div>
  )
}
export default Dashboard