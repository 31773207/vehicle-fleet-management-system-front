import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PageLayout from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Button, { AddButton } from '../../components/common/Button';
import '../../styles/global.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => { try { const r = await api.get('/dashboard/stats'); setStats(r.data); } catch(err) { console.error('Failed to load dashboard stats', err); } finally { setLoading(false); } };

  return (
    <PageLayout>
      <div className="page-header"><h2 className="page-title">📊 Dashboard</h2><AddButton onClick={fetchStats}>🔄 Refresh</AddButton></div>
      {loading?<LoadingSpinner text="Loading dashboard..."/>:!stats?(
        <div style={{textAlign:'center',padding:'60px',color:'#ea4335'}}>⚠️ Failed to load stats. Make sure the backend is running.</div>
      ):(<>
        <SectionTitle icon="fa-car" title="Fleet Overview" onNavigate={()=>navigate('/vehicles')}/>
        <div style={grid(4)}>
          <KpiCard label="Total Vehicles" value={stats.totalVehicles} color="#FFD700" icon="fa-car"/>
          <KpiCard label="Active" value={stats.activeVehicles} color="#34a853" icon="fa-check-circle" onClick={()=>navigate('/vehicles')}/>
          <KpiCard label="In Mission" value={stats.inMission} color="#1a73e8" icon="fa-road"/>
          <KpiCard label="In Revision" value={stats.inRevision} color="#fbbc04" icon="fa-search"/>
          <KpiCard label="Breakdown" value={stats.breakdown} color="#ea4335" icon="fa-exclamation-triangle" onClick={()=>navigate('/vehicles')}/>
          <KpiCard label="Assigned" value={stats.assignedVehicles} color="#9c27b0" icon="fa-link"/>
          <KpiCard label="Reformed" value={stats.reformed} color="#9e9e9e" icon="fa-archive"/>
          <KpiCard label="Total Employees" value={stats.totalDrivers} color="#00bcd4" icon="fa-users" onClick={()=>navigate('/drivers')}/>
        </div>
        <Divider/>
        <SectionTitle icon="fa-route" title="Missions" onNavigate={()=>navigate('/missions')}/>
        <div style={grid(5)}>
          <KpiCard label="Total" value={stats.totalMissions} color="#FFD700" icon="fa-flag"/>
          <KpiCard label="Planned" value={stats.missionsPlanned} color="#fbbc04" icon="fa-calendar"/>
          <KpiCard label="In Progress" value={stats.missionsInProgress} color="#1a73e8" icon="fa-spinner"/>
          <KpiCard label="Completed" value={stats.missionsCompleted} color="#34a853" icon="fa-check"/>
          <KpiCard label="Cancelled" value={stats.missionsCancelled} color="#ea4335" icon="fa-times"/>
        </div>
        <Divider/>
        <SectionTitle icon="fa-tools" title="Maintenance" onNavigate={()=>navigate('/maintenance')}/>
        <div style={grid(4)}>
          <KpiCard label="Total" value={stats.totalMaintenance} color="#FFD700" icon="fa-clipboard-list"/>
          <KpiCard label="Scheduled" value={stats.scheduledMaintenance} color="#fbbc04" icon="fa-calendar-check"/>
          <KpiCard label="In Progress" value={stats.openMaintenance} color="#1a73e8" icon="fa-wrench"/>
          <KpiCard label="Completed" value={stats.doneMaintenance} color="#34a853" icon="fa-check-double"/>
        </div>
        <CostBanner icon="fa-coins" color="#FFD700" label="Total Maintenance Cost" value={`${Number(stats.totalMaintenanceCost).toLocaleString('fr-DZ',{minimumFractionDigits:2})} DZD`}/>
        <Divider/>
        <SectionTitle icon="fa-clipboard-check" title="Technical Checks" onNavigate={()=>navigate('/technical-checks')}/>
        <div style={grid(3)}>
          <KpiCard label="Valid" value={stats.validChecks} color="#34a853" icon="fa-check-circle"/>
          <KpiCard label="Expired" value={stats.expiredChecks} color="#ea4335" icon="fa-times-circle" onClick={()=>navigate('/technical-checks')}/>
          <KpiCard label="Expiring Soon" value={stats.expiringSoon} color="#fbbc04" icon="fa-exclamation-circle" onClick={()=>navigate('/technical-checks')}/>
        </div>
        {stats.expiringSoon>0&&(
          <div className="alert alert-warning" style={{marginTop:'12px'}}>
            <i className="fas fa-exclamation-triangle"/>
            <span><strong>{stats.expiringSoon}</strong> vehicle(s) have technical checks expiring within 15 days.</span>
            <Button variant="warning" style={{padding:'3px 10px',fontSize:'12px',borderRadius:'4px'}} onClick={()=>navigate('/technical-checks')}>View →</Button>
          </div>
        )}
        <Divider/>
        <SectionTitle icon="fa-gas-pump" title="Fuel & Coupons" onNavigate={()=>navigate('/gas-coupons')}/>
        <div style={grid(4)}>
          <KpiCard label="Available" value={stats.couponsAvailable} color="#34a853" icon="fa-ticket-alt"/>
          <KpiCard label="Assigned" value={stats.couponsAssigned} color="#1a73e8" icon="fa-user-check"/>
          <KpiCard label="Used" value={stats.couponsUsed} color="#9e9e9e" icon="fa-check-circle"/>
          <KpiCard label="Transferred" value={stats.couponsTransferred} color="#ff9800" icon="fa-exchange-alt"/>
        </div>
        <CostBanner icon="fa-gas-pump" color="#34a853" label="Total Fuel Consumed" value={`${Number(stats.totalFuelUsed).toLocaleString('fr-DZ',{minimumFractionDigits:2})} L`}/>
      </>)}
    </PageLayout>
  );
}

function SectionTitle({ icon, title, onNavigate }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <i className={`fas ${icon}`} style={{color:'#FFD700',fontSize:'16px'}}/>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'14px',fontWeight:'700',color:'rgba(255,255,255,0.8)',textTransform:'uppercase',letterSpacing:'1px'}}>{title}</span>
      </div>
      <Button variant="primary" style={{padding:'3px 10px',fontSize:'12px',borderRadius:'4px',background:'transparent',border:'1px solid rgba(255,215,0,0.3)',color:'rgba(255,215,0,0.7)'}} onClick={onNavigate}>View all →</Button>
    </div>
  );
}

function KpiCard({ label, value, color, icon, onClick }) {
  return (
    <div onClick={onClick} style={{background:'rgba(0,0,0,0.45)',borderRadius:'10px',padding:'14px 16px',border:'1px solid rgba(255,255,255,0.06)',cursor:onClick?'pointer':'default',transition:'all 0.2s',backdropFilter:'blur(8px)',borderLeft:`3px solid ${color}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
        <span style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</span>
        <i className={`fas ${icon}`} style={{color,fontSize:'15px',opacity:0.8}}/>
      </div>
      <div style={{fontSize:'26px',fontWeight:'bold',color}}>{value??'—'}</div>
    </div>
  );
}

function CostBanner({ icon, color, label, value }) {
  return (
    <div style={{background:'rgba(0,0,0,0.4)',border:'1px solid rgba(255,215,0,0.15)',borderRadius:'10px',padding:'14px 22px',marginTop:'12px',display:'flex',alignItems:'center',gap:'14px',backdropFilter:'blur(8px)'}}>
      <i className={`fas ${icon}`} style={{color,fontSize:'22px'}}/>
      <div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.45)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</div><div style={{fontSize:'22px',fontWeight:'bold',color}}>{value}</div></div>
    </div>
  );
}

function Divider() { return <div style={{height:'1px',background:'rgba(255,215,0,0.08)',margin:'22px 0'}}/>; }
function grid(cols) { return {display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:'12px',marginBottom:'8px'}; }

export default Dashboard;
