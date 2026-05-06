import React, { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import "./../GasCoupons/GasCoupons.css";  // Reuse styles from GasCoupons page

function CouponAssignments() {
  const { addToast } = useToast();
  
  const [assignments, setAssignments] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assignments");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAssignments();
    fetchTransfers();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coupon-assignments");
      setAssignments(res.data);
    } catch (err) {
      addToast("Error loading assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfers = async () => {
    try {
      const res = await api.get("/coupon-transfers");
      console.log("Transfers data:", res.data);
      setTransfers(res.data);
    } catch (err) {
      console.error("Error fetching transfers", err);
    }
  };

  const getStatusBadge = (status) => {
    return <Badge status={status} />;
  };

  const filteredAssignments = assignments.filter(a => {
    if (search) {
      const employeeName = `${a.employee?.firstName} ${a.employee?.lastName}`.toLowerCase();
      const batchNumber = a.batch?.batchNumber?.toLowerCase() || "";
      if (!employeeName.includes(search.toLowerCase()) && !batchNumber.includes(search.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const filteredTransfers = transfers.filter(t => {
    if (search) {
      const batchNumber = t.batch?.batchNumber?.toLowerCase() || "";
      const orgName = t.toOrganization?.name?.toLowerCase() || "";
      if (!batchNumber.includes(search.toLowerCase()) && !orgName.includes(search.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const assignmentColumns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "batch", label: "Batch Number", render: (v) => v?.batchNumber || "—" },
    { key: "employee", label: "Employee", render: (v) => v ? `${v.firstName} ${v.lastName}` : "—" },
    { key: "quantity", label: "Total Received", render: (v) => v || 0 },
    { key: "remaining", label: "Remaining", render: (v) => v || 0 },
    { key: "usedQuantity", label: "Used", render: (v) => v || 0 },
    { key: "assignedDate", label: "Assigned Date", render: (v) => v || "—" },
    { key: "status", label: "Status", render: (v) => getStatusBadge(v) },
  ];

  const transferColumns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "batch", label: "Batch Number", render: (v) => v?.batchNumber || "—" },
    { key: "quantity", label: "Quantity", render: (v) => v || 0 },
    { key: "transferDate", label: "Transfer Date", render: (v) => v || "—" },
    { key: "toOrganization", label: "Transferred To", render: (v) => v?.name || "—" },
  ];

  return (
    <PageLayout>
      <div className="content-header">
        <h2 className="page-title">Coupon Tracking</h2>
      </div>

      {/* Tab Buttons and Search Bar in the same line */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid rgb(0, 2, 140)',
        paddingBottom: '10px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab("assignments")}
            style={{
              padding: '8px 16px',
              background: activeTab === "assignments" ? '#010823' : 'transparent',
              color: activeTab === "assignments" ? '#7facf9' : '#010823',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            <i className="fas fa-user-check"></i> Employee Assignments ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab("transfers")}
            style={{
              padding: '8px 16px',
              background: activeTab === "transfers" ? '#010823' : 'transparent',
              color: activeTab === "transfers" ? '#7facf9' : '#010823',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            <i className="fas fa-exchange-alt"></i> Organization Transfers ({transfers.length})
          </button>
        </div>
        
        {/* Search Bar */}
        <div style={{ width: '300px', position: 'relative' }}>
          <i 
            className="fas fa-search" 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.84)',
              fontSize: '14px',
              zIndex: 1,
              pointerEvents: 'none'
            }} 
          />
          <input
            type="text"
            placeholder={activeTab === "assignments" ? "Search by employee or batch..." : "Search by batch or organization..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 35px',
              borderRadius: '20px',
              border: '1px solid #034f626d',
              backgroundColor: '#feffff55',
              color: '#ffffffd2',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = '#001838'}
            onBlur={(e) => e.target.style.borderColor = '#001838'}
          />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {activeTab === "assignments" && (
            <DataTable columns={assignmentColumns} data={filteredAssignments} emptyMessage="No assignments found" />
          )}
          {activeTab === "transfers" && (
            <DataTable columns={transferColumns} data={filteredTransfers} emptyMessage="No transfers found" />
          )}
        </>
      )}
    </PageLayout>
  );
}

export default CouponAssignments;
