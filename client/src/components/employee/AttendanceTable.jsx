import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format, parseISO } from 'date-fns';

const AttendanceTable = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const workerId = user.empId;
  if (!workerId) {
    throw new Error('User not found in localStorage');
  }
  console.log('workerId', workerId);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/attendance/${workerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        setError('Failed to fetch attendance data');
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [workerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Check-Out Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Check-In Photo</TableCell>
            <TableCell>Check-Out Photo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((row) => {
            const parsedDate = parseISO(row.createdAt);
            const checkInTime = parseISO(row.checkIn);
            const checkOutTime = row.checkOut ? parseISO(row.checkOut) : null;
            return (
              <TableRow key={row._id}>
                <TableCell>{isNaN(parsedDate.getTime()) ? 'Invalid Date' : format(parsedDate, 'PP')}</TableCell>
                <TableCell>{isNaN(checkInTime.getTime()) ? 'Invalid Time' : format(checkInTime, 'pp')}</TableCell>
                <TableCell>{checkOutTime && !isNaN(checkOutTime.getTime()) ? format(checkOutTime, 'pp') : 'Not Checked Out'}</TableCell>
                <TableCell>
                  {row.location ? `Lat: ${row.location.latitude}, Lng: ${row.location.longitude}` : 'Location not available'}
                </TableCell>
                <TableCell>
                  {row.selfies && row.selfies[0] ? <img src={row.selfies[0]} alt="Check-In" width="100" height="100" /> : 'No Check-In Image'}
                </TableCell>
                <TableCell>
                  {row.selfies && row.selfies[1] ? <img src={row.selfies[1]} alt="Check-Out" width="100" height="100" /> : 'No Check-Out Image'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;