import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const ListShows = () => {

    const currency = import.meta.env.VITE_CURRENCY

    const {axios, getToken, user} = useAppContext()

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () =>{
        try {
            const { data } = await axios.get("/api/admin/all-shows", {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setShows(data.shows)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to fetch shows");
            console.error(error);
        }
    }

    useEffect(() => {
        if(user){
            getAllShows();
        }   
    }, [user]);

  return !loading ? (
    <>
      {/* Removed section title, now handled by navbar */}
      <div className="w-full mt-6 animate-fade-in-up">
        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-0 overflow-x-auto">
          <table className="w-full border-collapse rounded-2xl overflow-hidden text-nowrap">
             <thead>
              <tr className="bg-white text-left text-black">
                <th className="p-2 font-bold pl-5">Movie Name</th>
                <th className="p-2 font-bold">Show Time</th>
                <th className="p-2 font-bold">Language</th>
                <th className="p-2 font-bold">Total Bookings</th>
                <th className="p-2 font-bold">Earnings</th>
                </tr>
            </thead>
            <tbody className="text-sm font-light">
                {shows.map((show, index) => (
                <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 transition-all duration-300 hover:bg-white/20 hover:scale-[1.01]">
                        <td className="p-2 min-w-45 pl-5 alta-font">{show.movie.title}</td>
                        <td className="p-2">{dateFormat(show.showDateTime)}</td>
                        <td className="p-2">{show.language || 'N/A'}</td>
                        <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                        <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * (show.normalPrice || show.vipPrice || 0)}</td>
                    </tr>
                ))}
            </tbody>
         </table>
        </div>
      </div>
    </>
  ) : <Loading />
}

export default ListShows
