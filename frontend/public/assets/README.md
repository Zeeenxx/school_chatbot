# School Logo Instructions

## How to Add Your School Logo

1. **Prepare your logo image:**
   - Save your school logo as `school-logo.png` 
   - Recommended size: 200x200 pixels or larger (square format works best)
   - Supported formats: PNG, JPG, SVG

2. **Add the logo to the project:**
   - Copy your logo file to this folder: `public/assets/school-logo.png`

3. **Enable the logo in the chatbot:**
   - Open `src/components/ChatBot.tsx`
   - Find the comment: `{/* <SchoolLogo src="/assets/school-logo.png" alt="Osmeña Colleges Logo" /> */}`
   - Uncomment this line by removing `{/*` and `*/}`
   - Comment out or remove the placeholder: `<LogoPlaceholder>🏫</LogoPlaceholder>`

4. **Customize the logo (optional):**
   - You can adjust the logo size by modifying the `SchoolLogo` styled component
   - Change `width` and `height` properties as needed
   - Modify `border-radius` to make it more or less rounded

## Example Logo Integration

Replace this:
```jsx
<LogoPlaceholder>🏫</LogoPlaceholder>
{/* <SchoolLogo src="/assets/school-logo.png" alt="Osmeña Colleges Logo" /> */}
```

With this:
```jsx
{/* <LogoPlaceholder>🏫</LogoPlaceholder> */}
<SchoolLogo src="/assets/school-logo.png" alt="Osmeña Colleges Logo" />
```

Your logo will appear as a circular image at the top of the chatbot header!
