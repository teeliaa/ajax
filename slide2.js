$(document).ready(function () {
  let currentSlide = 0;

  function showSlide(index) {
    const slides = $('.slides');
    const totalSlides = slides.children().length;

    currentSlide = (index + totalSlides) % totalSlides;
    slides.css('transform', `translateX(-${currentSlide * 100}%)`);
  }

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);

  // YouTube API를 통해 동영상 로드
  function loadYouTubeVideo(containerId, videoId) {
    if (!YT || !YT.Player) {
      console.error('YouTube API가 로드되지 않았습니다.');
      return;
    }

    new YT.Player(containerId, {
      height: '450',
      width: '800',
      videoId: videoId,
      events: {
        onReady: (event) => {
          console.log(`YouTube Video ${videoId} Loaded Successfully`);
        },
        onError: (event) => {
          console.error(`YouTube API Error for video ${videoId}:`, event.data);
        },
      },
    });
  }

  function initializeYouTubeAPI() {
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = function () {
        console.log('YouTube API 준비 완료');
      };
    }
  }

  // YouTube API를 로드
  function loadYouTubeAPI() {
    if (!document.getElementById('youtube-api')) {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://www.youtube.com/iframe_api';
      scriptTag.id = 'youtube-api';
      document.head.appendChild(scriptTag);
    }
    initializeYouTubeAPI();
  }

  loadYouTubeAPI();

  // 콘텐츠를 iframe에 로드
  window.loadContent = function (src) {
    const slides = $('.slides');
    const leftSection = $('.left');
    const rightFrame = $('#right-frame');

    // 슬라이드 숨기기
    slides.hide();

    // Ajax로 콘텐츠 로드
    $.ajax({
      url: src,
      dataType: 'html',
      success: function (data) {
        // iframe에 srcdoc 속성을 통해 데이터 로드
        rightFrame.attr('srcdoc', data).show();

        // 동적으로 로드된 YouTube 동영상 처리
        const tempDiv = $('<div>').html(data); // 데이터를 임시로 jQuery 객체로 변환
        tempDiv.find('[data-video-id]').each(function () {
          const videoId = $(this).data('video-id');
          const containerId = $(this).attr('id');
          if (videoId && containerId) {
            loadYouTubeVideo(containerId, videoId);
          }
        });
      },
      error: function () {
        rightFrame.attr('srcdoc', '<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>').show();
      },
    });

    leftSection.show();
    rightFrame.show();
  };

  window.loadFullSection = function (src) {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const container = $('.container');
    const contentSection = $('#content');

    // 모든 섹션 숨기기
    leftSection.hide();
    rightSection.hide();
    container.hide();

    // Ajax로 콘텐츠 로드 (풀 섹션 용)
    $.ajax({
      url: src,
      dataType: 'html',
      success: function (data) {
        contentSection.html(data).show();
      },
      error: function () {
        contentSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      },
    });

    $('html, body').css('overflow', 'hidden');
  };

  window.showHome = function () {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const slides = $('.slides');
    const rightFrame = $('#right-frame');

    leftSection.show();
    rightSection.show();
    slides.show();
    rightFrame.hide();

    $('html, body').css('overflow', 'auto');
  };
});


