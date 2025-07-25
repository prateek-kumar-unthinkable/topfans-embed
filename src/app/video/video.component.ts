import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit {
  videoUrl: string | null = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.videoUrl = this.route.snapshot.queryParamMap.get('videoUrl');
    // console.log('[VideoComponent] ngOnInit called');
    if (this.videoUrl) {
      // console.log('[VideoComponent] videoUrl found:', this.videoUrl);
      setTimeout(async () => {
        const video = document.getElementById('videoPlayer') as HTMLVideoElement;
        if (video) {
          // console.log('[VideoComponent] video element found');
          if (this.videoUrl!.endsWith('.m3u8')) {
            // console.log('[VideoComponent] Detected .m3u8 file');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
              // console.log('[VideoComponent] Browser supports HLS natively');
              video.src = this.videoUrl!;
            } else {
              // console.log('[VideoComponent] Browser does NOT support HLS natively, trying hls.js');
              const Hls = (await import('hls.js')).default;
              if (Hls.isSupported()) {
                // console.log('[VideoComponent] hls.js is supported, initializing');
                const hls = new Hls();
                hls.loadSource(this.videoUrl!);
                hls.attachMedia(video);
              } else {
                console.error('[VideoComponent] HLS is not supported in this browser');
              }
            }
          } else if (
            this.videoUrl!.endsWith('.mp4') ||
            this.videoUrl!.endsWith('.webm') ||
            this.videoUrl!.endsWith('.ogg')
          ) {
            // console.log('[VideoComponent] Detected normal video file:', this.videoUrl);
            video.src = this.videoUrl!;
          } else {
            console.error('[VideoComponent] Unsupported video format:', this.videoUrl);
          }
        } else {
          console.error('[VideoComponent] video element not found');
        }
      });
    } else {
      // console.warn('[VideoComponent] No videoUrl provided in query params');
      this.videoUrl = null;
    }
  }
}
