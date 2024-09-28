import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format, parseISO } from 'date-fns';


const AttendanceTable = (workerId) => {
  console.log('workerId', workerId.employeeId);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/attendance/${workerId.employeeId}`);
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
            const checkInTime = parseISO(row.checkInTime);
            const checkOutTime = row.checkOutTime ? parseISO(row.checkOutTime) : null;
            return (
              <TableRow key={row._id}>
                <TableCell>{isNaN(parsedDate.getTime()) ? 'Invalid Date' : format(parsedDate, 'PP')}</TableCell>
                <TableCell>{isNaN(checkInTime.getTime()) ? 'Invalid Time' : format(checkInTime, 'pp')}</TableCell>
                <TableCell>{checkOutTime && !isNaN(checkOutTime.getTime()) ? format(checkOutTime, 'pp') : 'Not Checked Out'}</TableCell>
                <TableCell>
                  {row.location ? `Lat: ${row.location.latitude}, Lng: ${row.location.longitude}` : 'Location not available'}
                </TableCell>
                <TableCell>
                  {row.checkInImage ? <img src={row.checkInImage} alt="Check-In" width="100" height="100" /> : 'No Check-In Image'}
                </TableCell>
                <TableCell>
                  {row.checkOutImage ? <img src={row.checkOutImage} alt="Check-Out" width="100" /> : 'No Check-Out Image'}
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