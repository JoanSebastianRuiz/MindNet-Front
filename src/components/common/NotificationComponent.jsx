"use client"

import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUser } from '@/context/UserContext';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // URL del WebSocket
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/notifications', (message) => {
          const parsedMessage = JSON.parse(message.body);
          if (parsedMessage.idUser === user.id) {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              parsedMessage,
            ]);
          }
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    });

    client.activate();

    return () => {
      client.deactivate(); 
    };
  }, [user.id]); 

  useEffect(() => {
    
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [notifications]); 

  return (
    <div
      className="fixed z-50 p-4 space-y-2 w-full top-0 left-0 right-0 flex flex-col items-center md:left-auto md:right-auto md:w-auto md:bottom-0 md:space-y-4"
      style={{ maxWidth: '300px' }}
    >
      {/* Mostrar notificaciones apiladas */}
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-blue-500 text-white p-4 rounded-lg shadow-lg transform transition-all duration-300"
          style={{
            transitionDelay: `${index * 100}ms`, // Retraso para cada notificación
            marginBottom: '10px', 
          }}
        >
          <p>{notification.message}</p> 
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
