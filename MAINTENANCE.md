# Portfolio Maintenance Guide

This guide provides instructions for maintaining and updating the Marketing & Sales Executive Portfolio.

## 📅 Regular Maintenance Schedule

### Monthly Tasks
- [ ] Review and update analytics data
- [ ] Check for broken links
- [ ] Update contact information if changed
- [ ] Review and refresh testimonials
- [ ] Monitor website performance metrics

### Quarterly Tasks
- [ ] Update professional achievements and metrics
- [ ] Add new case studies or projects
- [ ] Refresh skills and certifications
- [ ] Update professional photos if needed
- [ ] Review and optimize SEO performance

### Annual Tasks
- [ ] Complete content audit and refresh
- [ ] Update design elements if needed
- [ ] Review and update technical dependencies
- [ ] Backup all website files and data
- [ ] Renew domain and hosting services

## 📝 Content Updates

### Updating Personal Information

#### Contact Details
1. Open `index.html`
2. Find the contact section (`id="contact"`)
3. Update email, phone, and location information
4. Update social media links in the social icons section

#### Professional Bio
1. Locate the about section (`id="about"`)
2. Update the bio paragraphs with current information
3. Modify expertise areas if needed
4. Update certifications and awards list

### Adding New Achievements

#### Timeline Updates
1. Find the experience section (`id="experience"`)
2. Add new timeline items following this structure:
```html
<div class="timeline-item" data-aos="fade-up" data-aos-delay="100">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <div class="timeline-header">
            <h3>Job Title</h3>
            <span class="company">Company Name</span>
            <span class="period">Start Date - End Date</span>
        </div>
        <div class="timeline-description">
            <p>Job description...</p>
            <ul class="achievements">
                <li>Achievement 1</li>
                <li>Achievement 2</li>
            </ul>
        </div>
    </div>
</div>
```

#### Metrics Updates
1. Open `js/script.js`
2. Find the `initializeCounters()` function
3. Update the `data-target` attributes in the HTML
4. Modify chart data in the `initializeCharts()` function

### Adding Case Studies

#### HTML Updates
1. Add new case study cards in the case studies section
2. Follow the existing card structure
3. Assign unique `data-case` attributes

#### JavaScript Updates
1. Open `js/script.js`
2. Find the `caseStudyData` object
3. Add new case study data following this structure:
```javascript
4: {
    title: 'New Case Study Title',
    description: 'Brief description...',
    challenge: 'Challenge description...',
    solution: 'Solution description...',
    results: [
        'Result 1',
        'Result 2',
        'Result 3'
    ],
    timeline: 'Duration',
    technologies: ['Tool 1', 'Tool 2']
}
```

### Updating Skills

#### Skill Percentages
1. Open `index.html`
2. Find the skills section (`id="skills"`)
3. Update `data-width` attributes for skill progress bars
4. Modify skill names and categories as needed

#### Tools and Technologies
1. Locate the tools grid in the skills section
2. Add or remove tool items
3. Update icons using Font Awesome classes

## 🖼️ Image Management

### Adding New Images

#### Professional Photos
1. Optimize images (WebP format recommended)
2. Upload to `assets/images/` directory
3. Update image paths in HTML
4. Ensure responsive sizing

#### Case Study Images
1. Create images at 350px × 200px
2. Optimize for web (under 100KB)
3. Use descriptive file names
4. Update alt text for accessibility

### Image Optimization
```bash
# Using ImageOptim or similar tools
# Target file sizes:
# - Hero images: < 200KB
# - Case study images: < 100KB
# - Testimonial photos: < 50KB
```

## 🔧 Technical Maintenance

### Dependency Updates

#### Checking for Updates
1. Review CDN links in `index.html`
2. Check for newer versions of:
   - Chart.js
   - AOS (Animate On Scroll)
   - Font Awesome
   - Google Fonts

#### Updating Dependencies
1. Test new versions in a staging environment
2. Update CDN links
3. Test all functionality
4. Deploy to production

### Performance Monitoring

#### Key Metrics to Track
- Page load speed (target: < 3 seconds)
- Core Web Vitals scores
- Mobile performance
- SEO rankings

#### Tools for Monitoring
- Google PageSpeed Insights
- GTmetrix
- Google Search Console
- Google Analytics

### Security Updates

#### Regular Security Checks
- Scan for vulnerabilities in dependencies
- Monitor for security advisories
- Keep hosting environment updated
- Review and update contact form security

## 📊 Analytics Maintenance

### Google Analytics Setup

#### Initial Configuration
1. Create GA4 property
2. Replace `GA_MEASUREMENT_ID` in HTML
3. Configure goals and conversions
4. Set up custom events

#### Regular Analytics Review
- Monthly traffic analysis
- Conversion rate monitoring
- User behavior insights
- Mobile vs desktop performance

### Custom Event Tracking

#### Adding New Events
1. Open `js/script.js`
2. Find the `trackEvent()` function
3. Add new tracking calls:
```javascript
// Example: Track new button click
document.getElementById('new-button').addEventListener('click', function() {
    trackEvent('Button', 'Click', 'New Feature');
});
```

## 🚀 Deployment & Hosting

### Deployment Checklist
- [ ] Test all functionality locally
- [ ] Optimize images and assets
- [ ] Minify CSS and JavaScript for production
- [ ] Update meta tags and SEO elements
- [ ] Test on multiple devices and browsers
- [ ] Deploy to staging environment
- [ ] Final testing on staging
- [ ] Deploy to production

### Hosting Maintenance

#### Regular Tasks
- Monitor uptime and performance
- Review hosting analytics
- Check SSL certificate expiration
- Monitor bandwidth usage
- Backup website files regularly

#### Recommended Hosting Features
- SSL certificate included
- CDN integration
- Automatic backups
- Performance monitoring
- 99.9% uptime guarantee

## 🔍 SEO Maintenance

### Content Optimization

#### Regular SEO Tasks
- Update meta descriptions
- Optimize image alt text
- Review and update keywords
- Monitor search rankings
- Submit updated sitemap

#### Technical SEO
- Check for broken links
- Optimize page load speeds

## 🌐 Custom Domain & DNS Management

If you add or remove a custom domain for the site, follow these steps to keep GitHub Pages working as expected.

### Removing the Custom Domain (return to GitHub Pages URL)
1. Open the repository on GitHub > Settings > Pages.
2. Under "Custom domain", clear the value and Save.
3. Confirm "Build and deployment" Source is set to "GitHub Actions".
4. Re-run the latest "Deploy to GitHub Pages" workflow (Actions tab) if needed.
5. Visit the default Pages URL: `https://<username>.github.io/<repo>/`.

Note: Our CI workflow also removes any `CNAME` file before publishing to prevent unintended redirects to an old domain.

### Removing DNS Records at Your Registrar
If your domain previously pointed to GitHub Pages, remove the records to stop resolution:
- Apex domain (example.com): delete A records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- Subdomain (www.example.com): delete the `CNAME` pointing to `<username>.github.io`.
- Remove any `ALIAS`/`ANAME` or wildcard `*` records that point to GitHub Pages.
- If using Cloudflare, disable/clear Page Rules and purge cache.

### Verifying DNS Changes
Run these commands (macOS/Linux) to check propagation:
```bash
dig +short ameladelianur.com A
dig +short www.ameladelianur.com CNAME
nslookup ameladelianur.com
nslookup www.ameladelianur.com
```
All commands should return empty or non‑GitHub values after removal.

### Caching & Propagation Tips
- DNS changes may take up to a few hours (TTL dependent).
- Use Private/Incognito window to bypass browser cache.
- Flush local DNS on macOS:
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### Adding a Custom Domain (optional)
If you want to use a domain again:
1. Add A records (apex) to: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
2. Add `CNAME` for `www` to `<username>.github.io`.
3. In GitHub > Settings > Pages, set your custom domain and enable "Enforce HTTPS".
4. Wait for certificate issuance and DNS propagation.
- Ensure mobile responsiveness
- Review structured data markup

### Local SEO (if applicable)
- Update business information
- Monitor local search rankings
- Manage online reviews
- Update location-based content

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
1. Check file paths in HTML
2. Verify image files exist in assets directory
3. Check file permissions
4. Ensure proper image formats

#### JavaScript Errors
1. Check browser console for errors
2. Verify CDN links are working
3. Test JavaScript functionality
4. Check for syntax errors

#### Mobile Display Issues
1. Test on actual mobile devices
2. Use browser developer tools
3. Check responsive breakpoints
4. Verify touch interactions

#### Performance Issues
1. Optimize large images
2. Minify CSS and JavaScript
3. Enable compression on server
4. Use CDN for static assets

### Emergency Procedures

#### Site Down
1. Check hosting service status
2. Verify domain configuration
3. Check SSL certificate
4. Contact hosting support if needed

#### Security Breach
1. Change all passwords immediately
2. Scan for malware
3. Review access logs
4. Contact hosting provider
5. Restore from clean backup

## 📞 Support Resources

### Technical Support
- Hosting provider documentation
- Browser developer tools
- Online communities (Stack Overflow, etc.)
- Web development forums

### Design Resources
- Adobe Creative Suite
- Figma for design updates
- Unsplash for stock photos
- Font Awesome for icons

### Analytics Support
- Google Analytics Help Center
- Google Search Console documentation
- SEO best practices guides

## 📋 Maintenance Log Template

```
Date: [Date]
Performed by: [Name]
Tasks completed:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

Issues found:
- Issue description and resolution

Next maintenance due: [Date]
Notes: [Additional notes]
```

---

Regular maintenance ensures the portfolio remains current, secure, and performs optimally. Follow this guide to keep the website running smoothly and effectively showcasing professional achievements.