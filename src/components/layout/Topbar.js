import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import bankLogo from '../../assets/bank.jpg'; // Adjust path as needed

const TYPE_ICON = {
  MAINTENANCE: { icon: 'fa-wrench',              color: '#17a2b8' },
  BREAKDOWN:   { icon: 'fa-exclamation-triangle', color: '#fd7e14' },
  EXPIRY:      { icon: 'fa-calendar-times',       color: '#dc3545' },
  MISSION:     { icon: 'fa-route',                color: '#28a745' },
  DEFAULT:     { icon: 'fa-bell',                 color: '#FFD700' },
};

function Topbar({ onMenuToggle }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [unreadCount,   setUnreadCount]   = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res      = await api.get('/notifications/unread');
      const countRes = await api.get('/notifications/count');
      setNotifications(res.data);
      setUnreadCount(countRes.data.count);
    } catch {
      // silently fail
    }
  };

  // Mark as read + navigate to link if present
  const handleClick = async (n) => {
    try {
      await api.patch(`/notifications/${n.id}/read`);
      fetchNotifications();
    } catch {}

    if (n.link) navigate(n.link);
    setShowDropdown(false);
  };

  const markAllRead = async () => {
    try {
      await Promise.all(notifications.map(n => api.patch(`/notifications/${n.id}/read`)));
      fetchNotifications();
    } catch {}
  };

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onMenuToggle && (
          <button className="mobile-menu-btn" onClick={onMenuToggle}>
            <i className="fas fa-bars"></i>
          </button>
        )}

<div className="topbar-title">
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px',color: '#020d4b' }}>
 
  Bank Of Algeria
  </div>      

</div>      
</div>

      <div className="topbar-notifications">
        <button className="topbar-bell" onClick={() => setShowDropdown(!showDropdown)}>
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className="topbar-badge">{unreadCount}</span>}
        </button>

        {showDropdown && (
          <div className="topbar-dropdown">

            {/* ── Header ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 14px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </span>
              {notifications.length > 0 && (
                <button onClick={markAllRead} style={{
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer',
                }}>
                  Mark all read
                </button>
              )}
            </div>

            {/* ── Items ── */}
            {notifications.length === 0 ? (
              <div className="topbar-empty">
                <i className="fas fa-bell-slash" style={{ display: 'block', fontSize: 22, marginBottom: 8, opacity: 0.3 }}></i>
                No new notifications
              </div>
            ) : (
              notifications.map(n => {
                const { icon, color } = TYPE_ICON[n.type] || TYPE_ICON.DEFAULT;
                return (
                  <div
                    key={n.id}
                    className="topbar-item"
                    onClick={() => handleClick(n)}
                    style={{ cursor: n.link ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

                      {/* Type icon bubble */}
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: `${color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className={`fas ${icon}`} style={{ color, fontSize: 13 }}></i>
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="topbar-item-title">{n.title}</div>
                        <div className="topbar-item-message">{n.message}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                          <div className="topbar-item-time" style={{ display: 'flex', fontSize: 13, color: '#dadada' }}>
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                          {n.link && (
                            <span style={{ fontSize: 13, color: 'rgb(0, 234, 255)' }}>Open →</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;
