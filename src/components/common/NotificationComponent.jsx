"use client"

import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUser } from '@/context/UserContext';
import { UserPlus, ThumbsUp, MessageSquare, AtSign } from "lucide-react";
import { useRouter } from 'next/navigation';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const { user, setNotificationsCount } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.id) return; // Evita ejecutar el código si user es null o undefined

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
            setNotificationsCount((prevCount) => prevCount + 1)
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
  }, [user?.id]); // Asegura que useEffect no se ejecute hasta que user esté definido


  useEffect(() => {

    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const getNotificationStyle = (type) => {
    switch (type) {
      case "follow":
        return { bg: "bg-blue-500", icon: <UserPlus className="w-6 h-6 text-white" /> };
      case "like":
        return { bg: "bg-green-500", icon: <ThumbsUp className="w-6 h-6 text-white" /> };
      case "comment":
        return { bg: "bg-orange-500", icon: <MessageSquare className="w-6 h-6 text-white" /> };
      case "mention":
        return { bg: "bg-purple-500", icon: <AtSign className="w-6 h-6 text-white" /> };
      default:
        return { bg: "bg-gray-500", icon: null };
    }
  };

  const handleNotificationClick = async (notification) => {
    if (notification.nameNotificationType === 'follow') {
      router.push(`/profile/${notification.usernameUserTrigger}`);
    } else if (notification.nameNotificationType === 'comment' || notification.nameNotificationType === 'like' || notification.nameNotificationType === 'mention') {
      router.push(`/post/${notification.idPost}`);
    }
  };

  return (
    <div
      className="fixed z-50 p-4 space-y-2 w-full top-0 left-0 right-0 flex flex-col items-center md:left-auto md:right-auto md:w-auto md:bottom-0 md:space-y-4"
      style={{ maxWidth: '300px' }}
    >
      {notifications.map((notification, index) => {
        const { bg, icon } = getNotificationStyle(notification.nameNotificationType);
        return (
          <button
            key={index}
            className={`flex items-center justify-between w-80 h-16 px-4 rounded-lg shadow-lg transition-all transform duration-300 
                    ${bg} hover:scale-105 hover:shadow-xl text-white font-medium animate-fadeIn`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-center gap-3">
              {icon}
              <span>{notification.message}</span>
            </div>
            {!notification.seen && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationComponent;
