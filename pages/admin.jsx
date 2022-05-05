import { faCancel, faCheck, faCheckSquare, faCoffee, faDeleteLeft, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DetailsModal from "../components/admin/DetailsModal";
import Layout from "../components/Layout"
import LayoutNoBg from "../components/LayoutNoBg";

const Admin = ({session}) => {
  
const [access, setAccess] = useState(false);
const [requests, setRequests] = useState([]);
const [modalOpen, setModalOpen] = useState(false);
const handleModalOpen = () => setModalOpen(true);
const handleModalClose = () => setModalOpen(false);
const [item, setItem] = useState({});

const getRequests = () =>{
  axios.post('/api/is-he-admin',{email:session.user.email
  },{
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
  }).then(res=>{
    setAccess(res.data.admin);
    axios.post('/api/get-all-requests')
    .then(requests=>{
      setRequests(requests.data);
      // console.log(requests, 1);
    })
  });
}
useEffect(()=>{
  getRequests();
},[])
const approveRequest = (email) => {
  axios.post('/api/hospital/approve',{
    email:email
  },
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => getRequests());
}

const rejectRequest = (email) => {
  axios.post('/api/hospital/reject',{
    email:email
  },
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => getRequests());
}

const deleteRequest = (email) => {
  axios.post('/api/hospital/delete',{
    email:email
  },
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => getRequests());
}

if(!access)
  return <Layout>
    it seems like you dont have access to this page
  </Layout>
    return <LayoutNoBg session={session} admin={true}>
      <div className="mx-10">

      
        <h1 className="heading text-2xl">Hospitals: Requests & Approved</h1>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hospital Name</TableCell>
              <TableCell>Hospital Email</TableCell>
              {/* <TableCell>Plan</TableCell> */}
              {/* <TableCell>Phone</TableCell> */}
              {/* <TableCell>Hospital Phone</TableCell> */}
              {/* <TableCell>Reason</TableCell> */}
              <TableCell>Approved</TableCell>
              {/* <TableCell>Payment</TableCell> */}
              <TableCell>Actions</TableCell>
              <TableCell>Status</TableCell>
            </TableHead>
            <TableBody>
              {requests.map((item)=>(<TableRow>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.hospitalName}</TableCell>
                <TableCell>{item.hospitalEmail}</TableCell>
                {/* <TableCell>{item.plan}</TableCell> */}
                {/* <TableCell>{item.phone}</TableCell> */}
                {/* <TableCell>{item.hospitalPhone}</TableCell> */}
                {/* <TableCell>{item.why}</TableCell> */}
                <TableCell>{item.approved?'Yes':'No'}</TableCell>
                {/* <TableCell>{item.paid?'Yes':'No'}</TableCell> */}
                
                <TableCell>
                  <div className="flex flex-row">
                  <Tooltip title="View Details">
                    <IconButton onClick={()=>{
                      setItem(item);
                      handleModalOpen();
                    }}>
                      <FontAwesomeIcon className="text-base" icon={faEye} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete">
                    <IconButton onClick={() => deleteRequest(item.email)}>
                      <FontAwesomeIcon className="text-base" icon={faTrash} />
                    </IconButton>
                  </Tooltip>
                  </div>
                </TableCell>
                {item.approved==-1?<TableCell>Rejected</TableCell>:<TableCell>
                  {item.approved==0?<div>
                <Tooltip title="Approve">
                    <IconButton onClick={() => approveRequest(item.email)}>
                      <FontAwesomeIcon className="text-base" icon={faCheckSquare} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton onClick={() => rejectRequest(item.email)}>
                      <FontAwesomeIcon className="text-base" icon={faCancel} />
                    </IconButton>
                  </Tooltip>
                  </div>:'Approved'}
                </TableCell>}
              </TableRow>))}
            </TableBody>
          </Table>

        </TableContainer>

          <DetailsModal modalOpen={modalOpen} handleModalClose={handleModalClose} item={item} approveRequest={approveRequest} rejectRequest={rejectRequest} />

        </div>
        <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Prompt:wght@700&display=swap');
        .heading {
            font-family: 'Prompt'
        }
        form, .list-disc, * {
            font-family: 'Poppins'
        }
      `}</style>
    </LayoutNoBg>
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
 
  // console.log(res);
  return {
    props: { session }
  }
}

export default Admin;
