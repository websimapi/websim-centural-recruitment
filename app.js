// Centural Game Studio Recruitment Application
const { useState, useEffect, useMemo } = React;
const { createRoot } = ReactDOM;

// Initialize WebsimSocket for database access
const room = new WebsimSocket();

// Admin configuration
/* @tweakable administrator usernames (comma-separated) */
const ADMIN_USERNAMES = "admin1,admin2";

// Application Fields Configuration
/* @tweakable application form fields */
const APPLICATION_FIELDS = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Email Address", type: "email", required: true },
  { id: "role", label: "Desired Role", type: "select", required: true, 
    options: ["Game Developer", "UI Designer", "3D Artist", "Sound Designer", "Writer", "Producer"] },
  { id: "experience", label: "Years of Experience", type: "number", required: true },
  { id: "portfolio", label: "Portfolio URL", type: "url", required: false },
  { id: "about", label: "Tell us about yourself", type: "textarea", required: true },
  { id: "why", label: "Why do you want to join Centural?", type: "textarea", required: true }
];

// Main App Component
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('landing'); // landing, apply, admin, success

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await window.websim.getCurrentUser();
        setCurrentUser(user);
        
        // Check if user is an admin
        const adminList = ADMIN_USERNAMES.split(',').map(name => name.trim());
        setIsAdmin(adminList.includes(user.username));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Check for URL parameters to set the initial view
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view && ['landing', 'apply', 'admin', 'success'].includes(view)) {
      setActiveView(view);
    }
  }, []);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="app">
      <Header 
        currentUser={currentUser} 
        isAdmin={isAdmin} 
        setActiveView={setActiveView} 
      />
      
      {activeView === 'landing' && <LandingPage setActiveView={setActiveView} />}
      {activeView === 'apply' && <ApplicationForm setActiveView={setActiveView} currentUser={currentUser} />}
      {activeView === 'admin' && isAdmin && <AdminPanel currentUser={currentUser} />}
      {activeView === 'admin' && !isAdmin && <AccessDenied setActiveView={setActiveView} />}
      {activeView === 'success' && <SuccessPage setActiveView={setActiveView} />}
      
      <Footer />
    </div>
  );
};

// Header Component
const Header = ({ currentUser, isAdmin, setActiveView }) => {
  return (
    <header className="header container">
      <div className="logo neon-text" onClick={() => setActiveView('landing')} style={{cursor: 'pointer'}}>
        <img src="logo.png" alt="Centural Game Studio" height="50" />
      </div>
      <nav>
        <button className="neon-button" onClick={() => setActiveView('apply')}>Apply Now</button>
        {isAdmin && (
          <button 
            className="neon-button" 
            style={{marginLeft: '1rem', borderColor: 'var(--neon-secondary)', color: 'var(--neon-secondary)'}}
            onClick={() => setActiveView('admin')}
          >
            Admin Panel
          </button>
        )}
      </nav>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="container" style={{padding: '2rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <p> {new Date().getFullYear()} Centural Game Studio</p>
        <div>
          <a href="#" style={{color: 'var(--text-dim)', marginRight: '1rem', textDecoration: 'none'}}>Privacy Policy</a>
          <a href="#" style={{color: 'var(--text-dim)', textDecoration: 'none'}}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
      <div className="neon-text pulse" style={{fontSize: '2rem', marginBottom: '1rem'}}>CENTURAL</div>
      <div className="neon-border" style={{width: '50px', height: '50px', borderRadius: '50%', animation: 'pulse 1.5s infinite'}}></div>
    </div>
  );
};

// Landing Page Component
const LandingPage = ({ setActiveView }) => {
  return (
    <div className="landing-page">
      <section className="hero" style={{padding: '6rem 0 4rem', textAlign: 'center'}}>
        <div className="container">
          <h1 className="neon-text" style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>
            Join The Future of Gaming
          </h1>
          <p style={{fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem', color: 'var(--text-dim)'}}>
            Centural Game Studio is looking for talented individuals to help create the next generation of immersive Websim experiences.
          </p>
          <button 
            className="neon-button" 
            style={{padding: '1rem 2rem', fontSize: '1.25rem'}}
            onClick={() => setActiveView('apply')}
          >
            Apply Now
          </button>
        </div>
      </section>
      
      <section className="features container">
        <div className="grid">
          <FeatureCard 
            title="Creative Freedom" 
            description="Work on innovative projects where your ideas matter and help shape the future of gaming." 
            icon=" " 
          />
          <FeatureCard 
            title="Cutting-Edge Tech" 
            description="Experience development with the latest WebsimSocket technologies and tools." 
            icon="" 
          />
          <FeatureCard 
            title="Remote-Friendly" 
            description="Join our global team and collaborate from anywhere in the world." 
            icon=" " 
          />
        </div>
      </section>
      
      <section className="roles container" style={{padding: '4rem 0'}}>
        <h2 className="neon-text" style={{marginBottom: '2rem', textAlign: 'center'}}>Open Positions</h2>
        <div className="grid">
          <RoleCard 
            title="Game Developer" 
            requirements="JavaScript, React, WebGL" 
            description="Create engaging gameplay mechanics and interactive experiences" 
          />
          <RoleCard 
            title="UI Designer" 
            requirements="Figma, CSS, Animation" 
            description="Design futuristic, neon-themed interfaces that captivate users" 
          />
          <RoleCard 
            title="3D Artist" 
            requirements="Blender, Three.js, Texturing" 
            description="Model and animate assets for immersive web-based environments" 
          />
          <RoleCard 
            title="Sound Designer" 
            requirements="Audio Production, SFX Creation" 
            description="Craft atmospheric soundscapes and interactive audio experiences" 
          />
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{icon}</div>
      <h3 className="neon-text" style={{marginBottom: '1rem'}}>{title}</h3>
      <p style={{color: 'var(--text-dim)'}}>{description}</p>
    </div>
  );
};

// Role Card Component
const RoleCard = ({ title, requirements, description }) => {
  return (
    <div className="card">
      <h3 className="neon-text" style={{marginBottom: '0.5rem'}}>{title}</h3>
      <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '1rem'}}>
        {requirements.split(', ').map((req, index) => (
          <span 
            key={index} 
            style={{
              backgroundColor: 'rgba(0, 243, 255, 0.1)', 
              color: 'var(--neon-primary)', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px', 
              fontSize: '0.8rem',
              marginRight: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            {req}
          </span>
        ))}
      </div>
      <p style={{color: 'var(--text-dim)'}}>{description}</p>
    </div>
  );
};

// Application Form Component
const ApplicationForm = ({ setActiveView, currentUser }) => {
  const initialFormData = useMemo(() => {
    const data = {};
    APPLICATION_FIELDS.forEach(field => {
      data[field.id] = '';
    });
    return data;
  }, []);
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    APPLICATION_FIELDS.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid email address';
      }
      
      if (field.type === 'url' && formData[field.id] && !/^https?:\/\/\S+$/.test(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid URL (starting with http:// or https://)';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create application record in database
      await room.collection('application').create({
        ...formData,
        status: 'pending',
        submitted_at: new Date().toISOString()
      });
      
      // Navigate to success page
      setActiveView('success');
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrors(prev => ({
        ...prev,
        submit: 'An error occurred while submitting your application. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container" style={{maxWidth: '800px', padding: '3rem 1.5rem'}}>
      <h1 className="neon-text" style={{marginBottom: '2rem', textAlign: 'center'}}>Join Our Team</h1>
      
      <div className="panel">
        <form onSubmit={handleSubmit}>
          {APPLICATION_FIELDS.map(field => (
            <div className="form-group" key={field.id}>
              <label htmlFor={field.id}>
                {field.label} {field.required && <span style={{color: 'var(--danger)'}}>*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select 
                  id={field.id} 
                  name={field.id} 
                  value={formData[field.id]} 
                  onChange={handleChange}
                  className="neon-input"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea 
                  id={field.id} 
                  name={field.id} 
                  value={formData[field.id]} 
                  onChange={handleChange} 
                  className="neon-input"
                  required={field.required}
                  rows={5}
                ></textarea>
              ) : (
                <input 
                  type={field.type} 
                  id={field.id} 
                  name={field.id} 
                  value={formData[field.id]} 
                  onChange={handleChange} 
                  className="neon-input"
                  required={field.required}
                  min={field.type === 'number' ? 0 : undefined}
                />
              )}
              
              {errors[field.id] && (
                <div style={{color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem'}}>
                  {errors[field.id]}
                </div>
              )}
            </div>
          ))}
          
          {errors.submit && (
            <div style={{color: 'var(--danger)', margin: '1rem 0', padding: '1rem', backgroundColor: 'rgba(255, 51, 102, 0.1)', borderRadius: '4px'}}>
              {errors.submit}
            </div>
          )}
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem'}}>
            <button 
              type="button" 
              className="neon-button" 
              style={{borderColor: 'var(--text-dim)', color: 'var(--text-dim)'}}
              onClick={() => setActiveView('landing')}
              disabled={isSubmitting}
            >
              Back
            </button>
            
            <button 
              type="submit" 
              className="neon-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Success Page Component
const SuccessPage = ({ setActiveView }) => {
  return (
    <div className="container" style={{maxWidth: '800px', padding: '3rem 1.5rem', textAlign: 'center'}}>
      <div className="panel" style={{borderColor: 'var(--success)'}}>
        <div style={{fontSize: '4rem', marginBottom: '1rem'}}></div>
        <h1 className="neon-text" style={{marginBottom: '1rem'}}>Application Submitted!</h1>
        <p style={{marginBottom: '2rem', fontSize: '1.1rem'}}>
          Thank you for your interest in joining Centural Game Studio. We've received your application and will review it shortly.
        </p>
        <p style={{marginBottom: '2rem', color: 'var(--text-dim)'}}>
          If your profile matches our requirements, we'll contact you for the next steps in the application process.
        </p>
        <button 
          className="neon-button"
          onClick={() => setActiveView('landing')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ currentUser }) => {
  // Subscribe to application records
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const unsubscribe = room.collection('application').subscribe(apps => {
      setApplications(apps);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Filter applications based on status and search term
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Filter by status
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          (app.name && app.name.toLowerCase().includes(searchLower)) ||
          (app.email && app.email.toLowerCase().includes(searchLower)) ||
          (app.role && app.role.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [applications, statusFilter, searchTerm]);
  
  // Handle status update
  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await room.collection('application').update(appId, {
        status: newStatus,
        reviewed_by: currentUser.username,
        reviewed_at: new Date().toISOString()
      });
      
      // Close detail view if we're updating the currently selected app
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(null);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Error updating application status. You may not have permission to modify this record.");
    }
  };
  
  return (
    <div className="container" style={{padding: '2rem 1.5rem'}}>
      <h1 className="neon-text" style={{marginBottom: '2rem'}}>Admin Panel</h1>
      
      <div className="panel">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <div>
            <h2 style={{marginBottom: '0.5rem'}}>Applications</h2>
            <p style={{color: 'var(--text-dim)'}}>{filteredApplications.length} results</p>
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="neon-input" 
              style={{marginBottom: 0, width: '250px'}} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select 
              className="neon-input" 
              style={{marginBottom: 0, width: '150px'}} 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem 0'}}>
            <p style={{color: 'var(--text-dim)', fontSize: '1.1rem'}}>No applications found</p>
          </div>
        ) : (
          <div style={{display: 'flex'}}>
            <div style={{flex: 1, borderRight: selectedApp ? '1px solid rgba(255, 255, 255, 0.1)' : 'none', paddingRight: selectedApp ? '1.5rem' : 0}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                      Name
                    </th>
                    <th style={{textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                      Role
                    </th>
                    <th style={{textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                      Status
                    </th>
                    <th style={{textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)} 
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedApp && selectedApp.id === app.id ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <td style={{padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)'}}>
                        {app.name}
                      </td>
                      <td style={{padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)'}}>
                        {app.role}
                      </td>
                      <td style={{padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)'}}>
                        <span className={`status-badge status-${app.status}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{padding: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)'}}>
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {selectedApp && (
              <div style={{flex: 1, paddingLeft: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <h3 className="neon-text">Application Details</h3>
                  <button 
                    className="neon-button" 
                    style={{padding: '0.4rem 0.8rem', fontSize: '0.875rem'}}
                    onClick={() => setSelectedApp(null)}
                  >
                    Close
                  </button>
                </div>
                
                <div style={{marginBottom: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <h2>{selectedApp.name}</h2>
                    <span className={`status-badge status-${selectedApp.status}`}>
                      {selectedApp.status}
                    </span>
                  </div>
                  
                  <p style={{color: 'var(--text-dim)', marginBottom: '0.5rem'}}>
                    Submitted: {new Date(selectedApp.submitted_at).toLocaleString()}
                  </p>
                  
                  {selectedApp.reviewed_at && (
                    <p style={{color: 'var(--text-dim)', marginBottom: '0.5rem'}}>
                      Reviewed by {selectedApp.reviewed_by} on {new Date(selectedApp.reviewed_at).toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div style={{marginBottom: '2rem'}}>
                  {APPLICATION_FIELDS.map(field => (
                    <div key={field.id} style={{marginBottom: '1.5rem'}}>
                      <h4 style={{marginBottom: '0.5rem', color: 'var(--text-dim)'}}>{field.label}</h4>
                      <div style={{fontSize: '1rem'}}>
                        {field.type === 'url' && selectedApp[field.id] ? (
                          <a 
                            href={selectedApp[field.id]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{color: 'var(--neon-primary)', textDecoration: 'none'}}
                          >
                            {selectedApp[field.id]}
                          </a>
                        ) : (
                          <p style={{whiteSpace: 'pre-wrap'}}>{selectedApp[field.id] || '-'}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{display: 'flex', gap: '1rem'}}>
                  {selectedApp.status !== 'approved' && (
                    <button 
                      className="neon-button" 
                      style={{borderColor: 'var(--success)', color: 'var(--success)'}}
                      onClick={() => updateApplicationStatus(selectedApp.id, 'approved')}
                    >
                      Approve
                    </button>
                  )}
                  
                  {selectedApp.status !== 'archived' && (
                    <button 
                      className="neon-button" 
                      style={{borderColor: 'var(--danger)', color: 'var(--danger)'}}
                      onClick={() => updateApplicationStatus(selectedApp.id, 'archived')}
                    >
                      Archive
                    </button>
                  )}
                  
                  {selectedApp.status !== 'pending' && (
                    <button 
                      className="neon-button" 
                      style={{borderColor: 'var(--warning)', color: 'var(--warning)'}}
                      onClick={() => updateApplicationStatus(selectedApp.id, 'pending')}
                    >
                      Mark as Pending
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Access Denied Component
const AccessDenied = ({ setActiveView }) => {
  return (
    <div className="container" style={{maxWidth: '800px', padding: '3rem 1.5rem', textAlign: 'center'}}>
      <div className="panel" style={{borderColor: 'var(--danger)'}}>
        <div style={{fontSize: '4rem', marginBottom: '1rem'}}></div>
        <h1 className="neon-text" style={{marginBottom: '1rem', color: 'var(--danger)'}}>Access Denied</h1>
        <p style={{marginBottom: '2rem', fontSize: '1.1rem'}}>
          You don't have permission to access the admin panel. Only authorized administrators can view this section.
        </p>
        <button 
          className="neon-button"
          onClick={() => setActiveView('landing')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

// Render the App
const root = createRoot(document.getElementById('app'));
root.render(<App />);