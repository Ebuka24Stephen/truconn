"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { OrganizationSidebar } from "@/components/organization-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Edit2, Save, X, MapPin, Mail, Phone, LinkIcon, Shield, Star, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { AuthAPI } from "@/lib/auth/api"
import { OrganizationAPI } from "@/lib/organization/api"

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  
  // Check if user is organization
  const isOrganization = user?.role === "organization" || user?.role === "ORGANIZATION"
  
  // Initialize profile data with user data from auth
  const [profileData, setProfileData] = useState({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    // Citizen/Profile fields
    title: "",
    company: "",
    location: "",
    phone: "",
    website: "",
    bio: "",
    // Organization fields
    organizationName: "",
    organizationEmail: "",
    organizationWebsite: "",
    organizationAddress: "",
    trustScore: null as number | null,
    trustLevel: "",
    verified: false,
    connections: 0,
    views: 0,
  })

  const [editData, setEditData] = useState(profileData)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [error, setError] = useState("")

  // Load profile data from API
  useEffect(() => {
    if (user && isAuthenticated) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated])

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true)
      setError("")
      
      if (isOrganization) {
        // Load organization data
        const orgData = await OrganizationAPI.getOrganizationDetail()
        const org = orgData.organization
        
        setProfileData({
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          email: user?.email || "",
          // Organization fields from Org model
          organizationName: org.name || "",
          organizationEmail: org.email || "",
          organizationWebsite: org.website || "",
          organizationAddress: org.address || "",
          trustScore: org.trust_score,
          trustLevel: org.trust_level || "",
          // Not used for organizations
          title: "",
          company: "",
          location: "",
          phone: "",
          website: "",
          bio: "",
          verified: true,
          connections: 0,
          views: 0,
        })
        setEditData({
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          email: user?.email || "",
          organizationName: org.name || "",
          organizationEmail: org.email || "",
          organizationWebsite: org.website || "",
          organizationAddress: org.address || "",
          trustScore: org.trust_score,
          trustLevel: org.trust_level || "",
          title: "",
          company: "",
          location: "",
          phone: "",
          website: "",
          bio: "",
          verified: true,
          connections: 0,
          views: 0,
        })
      } else {
        // Load citizen profile data
        const profile = await AuthAPI.getProfile()
        
        setProfileData({
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          email: user?.email || "",
          title: profile.title || "",
          company: profile.company || "",
          location: profile.location || "",
          phone: profile.phone_no || "",
          website: profile.url || "",
          bio: profile.about || "",
          verified: false,
          // Not used for citizens
          organizationName: "",
          organizationEmail: "",
          organizationWebsite: "",
          organizationAddress: "",
          trustScore: null,
          trustLevel: "",
          connections: 0,
          views: 0,
        })
        setEditData({
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          email: user?.email || "",
          title: profile.title || "",
          company: profile.company || "",
          location: profile.location || "",
          phone: profile.phone_no || "",
          website: profile.url || "",
          bio: profile.about || "",
          verified: false,
          organizationName: "",
          organizationEmail: "",
          organizationWebsite: "",
          organizationAddress: "",
          trustScore: null,
          trustLevel: "",
          connections: 0,
          views: 0,
        })
      }
    } catch (err) {
      // If profile doesn't exist, use user data only
      if (user) {
        const defaultData = {
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          title: "",
          company: "",
          location: "",
          phone: "",
          website: "",
          bio: "",
          verified: isOrganization,
          organizationName: "",
          organizationEmail: "",
          organizationWebsite: "",
          organizationAddress: "",
          trustScore: null,
          trustLevel: "",
          connections: 0,
          views: 0,
        }
        setProfileData(defaultData)
        setEditData(defaultData)
      }
      console.error("Error loading profile:", err)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  const handleEdit = () => {
    setIsEditing(true)
    // Sync editData with current profileData
    setEditData({ ...profileData })
  }

  const handleSave = async () => {
    try {
      setError("")
      setIsLoadingProfile(true)
      
      if (isOrganization) {
        // Note: Organization update endpoint doesn't exist yet in backend
        // For now, we can only display organization data
        setError("Organization profile updates are not yet available. Please contact support.")
        setIsEditing(false)
        return
      } else {
        // Map frontend format to backend format for citizen profile
        const updateData = {
          title: editData.title || "",
          company: editData.company || "",
          url: editData.website || "",
          phone_no: editData.phone || "",
          about: editData.bio || "",
          location: editData.location || "",
        }
        
        await AuthAPI.updateProfile(updateData)
        
        // Update local state
        setProfileData(editData)
        setIsEditing(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
      console.error("Error updating profile:", err)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show message if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Determine which sidebar to use based on user role
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : CitizenSidebar

  return (
    <div className="flex h-screen bg-black">
      <SidebarComponent />

      <main className="flex-1 overflow-auto">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-purple-900/30 via-black to-violet-900/30 sticky top-0 z-30" />

        <div className="px-6 pb-12">
          <div className="max-w-4xl mx-auto -mt-16 relative z-40">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}
            {/* Profile Card */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl shadow-2xl mb-8">
              <div className="p-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-lg shadow-purple-500/50">
                      {isOrganization ? (
                        profileData.organizationName?.charAt(0)?.toUpperCase() || "O"
                      ) : (
                        <>
                          {profileData.firstName?.charAt(0)?.toUpperCase() || ""}
                          {profileData.lastName?.charAt(0)?.toUpperCase() || ""}
                          {!profileData.firstName && !profileData.lastName && (
                            <span className="text-3xl">👤</span>
                          )}
                        </>
                      )}
                    </div>
                    {!isEditing && !isOrganization && (
                      <Button onClick={handleEdit} className="trust-button">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                    {isOrganization && (
                      <p className="text-xs text-gray-400 text-center sm:text-left mt-2">
                        Organization profile is read-only
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    {isOrganization ? (
                      // Organization view
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-3xl font-bold text-white">
                            {profileData.organizationName || "Organization"}
                          </h1>
                          {profileData.verified && <Shield className="w-6 h-6 text-emerald-400" />}
                        </div>
                        <p className="text-lg text-gray-300 mb-1">
                          {profileData.firstName} {profileData.lastName}
                        </p>
                        {profileData.trustScore !== null && (
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-gray-400">
                              Trust Score: {profileData.trustScore.toFixed(1)} ({profileData.trustLevel})
                            </span>
                          </div>
                        )}
                      </>
                    ) : isEditing ? (
                      // Citizen edit view
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-purple-300 mb-1">First Name</label>
                            <Input
                              name="firstName"
                              value={editData.firstName}
                              onChange={handleChange}
                              className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-purple-300 mb-1">Last Name</label>
                            <Input
                              name="lastName"
                              value={editData.lastName}
                              onChange={handleChange}
                              className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-1">Title</label>
                          <Input
                            name="title"
                            value={editData.title}
                            onChange={handleChange}
                            className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-1">Company</label>
                          <Input
                            name="company"
                            value={editData.company}
                            onChange={handleChange}
                            className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                          />
                        </div>
                      </div>
                    ) : (
                      // Citizen view
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-3xl font-bold text-white">
                            {profileData.firstName} {profileData.lastName}
                          </h1>
                          {profileData.verified && <Shield className="w-6 h-6 text-emerald-400" />}
                        </div>
                        <p className="text-lg text-gray-300 mb-1">{profileData.title}</p>
                        <p className="text-gray-400">{profileData.company}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {!isEditing && (
                  <div className={`grid gap-4 py-6 border-y border-purple-900/30 mb-8 ${isOrganization ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {isOrganization && profileData.trustScore !== null ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                          <p className="text-3xl font-bold text-purple-300">{profileData.trustScore.toFixed(1)}</p>
                        </div>
                        <p className="text-sm text-gray-400">Trust Score ({profileData.trustLevel})</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-300">{profileData.connections}</p>
                          <p className="text-sm text-gray-400">Connections</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-300">{profileData.views}</p>
                          <p className="text-sm text-gray-400">Profile Views</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <h2 className="text-lg font-semibold text-white">Contact Information</h2>
                  {isOrganization ? (
                    // Organization contact info (read-only)
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <a href={`mailto:${profileData.organizationEmail}`} className="hover:text-purple-300 transition">
                          {profileData.organizationEmail || profileData.email}
                        </a>
                      </div>
                      {profileData.organizationWebsite && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <LinkIcon className="w-5 h-5 text-purple-400" />
                          <a
                            href={profileData.organizationWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-300 transition"
                          >
                            {profileData.organizationWebsite}
                          </a>
                        </div>
                      )}
                      {profileData.organizationAddress && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-5 h-5 text-purple-400" />
                          <span>{profileData.organizationAddress}</span>
                        </div>
                      )}
                    </div>
                  ) : isEditing ? (
                    // Citizen edit form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Email</label>
                        <Input
                          name="email"
                          type="email"
                          value={editData.email}
                          onChange={handleChange}
                          className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                          disabled
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Phone</label>
                        <Input
                          name="phone"
                          value={editData.phone}
                          onChange={handleChange}
                          className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Website</label>
                        <Input
                          name="website"
                          value={editData.website}
                          onChange={handleChange}
                          className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Location</label>
                        <Input
                          name="location"
                          value={editData.location}
                          onChange={handleChange}
                          className="bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                        />
                      </div>
                    </div>
                  ) : (
                    // Citizen view
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <a href={`mailto:${profileData.email}`} className="hover:text-purple-300 transition">
                          {profileData.email}
                        </a>
                      </div>
                      {profileData.phone && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Phone className="w-5 h-5 text-purple-400" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                      {profileData.website && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <LinkIcon className="w-5 h-5 text-purple-400" />
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-300 transition"
                          >
                            {profileData.website}
                          </a>
                        </div>
                      )}
                      {profileData.location && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-5 h-5 text-purple-400" />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio - Only for citizens */}
                {!isOrganization && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">About</h2>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none bg-white text-black placeholder:text-gray-500"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{profileData.bio || "No bio available"}</p>
                    )}
                  </div>
                )}

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-purple-900/30">
                    <Button onClick={handleSave} className="flex-1 trust-button">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Additional sections removed as requested */}
          </div>
        </div>
      </main>
    </div>
  )
}
