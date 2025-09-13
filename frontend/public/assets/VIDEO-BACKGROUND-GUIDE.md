# Video Background Setup Guide

## How to Add Your Video Background

### 1. Video Requirements
- **Format**: MP4 (H.264 codec) is recommended for best compatibility
- **Resolution**: 1920x1080 (Full HD) or higher
- **Duration**: 10-30 seconds (will loop automatically)
- **File Size**: Keep under 10MB for optimal loading
- **Content**: Should be relevant to your school (campus, students, activities)

### 2. Adding Your Video

1. **Place your video file** in this directory (`frontend/public/assets/`)
2. **Rename it** to `background-video.mp4`
3. **Optional**: Create a WebM version for better browser support

### 3. Fallback Image

1. **Create a fallback image** (JPG/PNG) that represents your school
2. **Place it** in this directory as `default-bg.jpg`
3. **Recommended size**: 1920x1080 or similar aspect ratio

### 4. Video Optimization Tips

#### For Better Performance:
- **Compress your video** using tools like:
  - HandBrake (free)
  - Adobe Media Encoder
  - Online tools like CloudConvert
- **Target settings**:
  - Bitrate: 2-5 Mbps
  - Frame rate: 24-30 fps
  - Resolution: 1920x1080

#### For Mobile Devices:
- Consider creating a **mobile-optimized version** (smaller file size)
- The component will automatically fall back to the image on slower connections

### 5. Testing Your Video

1. **Start your development server**: `npm start`
2. **Check the main page** - you should see your video playing
3. **Test on mobile devices** to ensure good performance
4. **Check browser console** for any loading errors

### 6. Troubleshooting

#### Video Not Playing:
- Check file path: `/assets/background-video.mp4`
- Verify file format (MP4 with H.264)
- Check browser console for errors
- Ensure file is not corrupted

#### Poor Performance:
- Reduce video file size
- Lower resolution or bitrate
- Consider using a shorter video loop

#### Fallback Not Working:
- Check fallback image path: `/assets/default-bg.jpg`
- Verify image file exists and is accessible

### 7. Customization Options

You can modify the video background settings in `App.tsx`:

```tsx
<VideoBackground 
  videoSrc="/assets/background-video.mp4"        // Your video file
  fallbackImage="/assets/default-bg.jpg"         // Fallback image
  overlay={true}                                 // Dark overlay for text readability
  overlayOpacity={0.4}                          // Overlay darkness (0-1)
/>
```

### 8. Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Full support with automatic fallback

### 9. Accessibility

The video background includes:
- **Automatic fallback** to image for unsupported browsers
- **Loading indicator** while video loads
- **Error handling** for failed video loads
- **Performance optimization** for mobile devices

### 10. Example Video Ideas

- Campus aerial shots
- Students in classrooms/labs
- School events and activities
- Graduation ceremonies
- Sports activities
- Library or study areas
- School building exteriors

Remember: Keep the video content professional and relevant to your educational institution!

