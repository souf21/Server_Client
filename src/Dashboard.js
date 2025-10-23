import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { supabase } from './supabaseClient';


function Dashboard({ session }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const user = session?.user; 

  
  useEffect(() => {
    if (user) {
      fetchUserFiles(user.id);
    }
  }, [user]); 
  
  const fetchUserFiles = async (userId) => {
    setError(''); 
    try {
      
      const { data, error } = await supabase
        .from('files') 
        .select('*') 
        .eq('user_id', userId); 

      if (error) throw error; 
      setFiles(data); 
    } catch (error) {
      setError('Error fetching files: ' + error.message);
      console.error('Error fetching files:', error);
    }
  };

  
  const handleFileUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      
      return;
    }

    const file = event.target.files[0]; 
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    setUploading(true); 
    setError(''); 

    try {
     
      const { error: uploadError } = await supabase.storage
        .from('documents') 
        .upload(fileName, file);

      if (uploadError) throw uploadError; 

      
      const { data, error: insertError } = await supabase
        .from('files')
        .insert([
          {
            user_id: user.id,          
            file_name: file.name,     
            storage_path: fileName,    
            file_size: file.size,      
            mime_type: file.type,      
            
          },
        ])
        .select(); 

      if (insertError) throw insertError; 

      alert('File uploaded successfully!');
      fetchUserFiles(user.id); 
      event.target.value = null; 
    } catch (error) {
      setError('Error uploading file: ' + error.message);
      console.error('Error during file upload:', error);
    } finally {
      setUploading(false); 
    }
  };


  const handleLogout = async () => {
    setError(''); 
    const { error } = await supabase.auth.signOut(); 
    if (error) {
      setError(error.message);
      console.error('Error logging out:', error);
    } else {
      alert('Logged out successfully!');
      
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.email}!</h2>
      <button onClick={handleLogout}>Logout</button>

      {error && <p className="error-message">{error}</p>} {}

      <div className="file-upload-section">
        <h3>Upload New File</h3>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading} 
        />
        {uploading && <p>Uploading...</p>} {}
      </div>

      <div className="file-list-section">
        <h3>Your Files</h3>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.file_name} ({(file.file_size / 1024).toFixed(2)} KB) -{' '}
                <a
                  
                  href={supabase.storage.from('documents').getPublicUrl(file.storage_path).data.publicUrl}
                  target="_blank" 
                  rel="noopener noreferrer" 
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;